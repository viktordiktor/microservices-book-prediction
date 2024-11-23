package com.nikanenka.services.impl;

import com.nikanenka.dto.BookRequest;
import com.nikanenka.dto.BookResponse;
import com.nikanenka.dto.BookSellRequest;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.exceptions.BookAlreadyExistsException;
import com.nikanenka.exceptions.BookNotFoundException;
import com.nikanenka.exceptions.ImageRequiredException;
import com.nikanenka.models.Book;
import com.nikanenka.models.Image;
import com.nikanenka.repositories.BookRepository;
import com.nikanenka.services.BookService;
import com.nikanenka.utils.LogList;
import com.nikanenka.utils.PageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {
    private final ImageServiceImpl imageService;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<BookResponse> getAllBooks
            (int pageNumber, int pageSize, String sortField, String sortType, String searchRequest) {
        Pageable pageable = PageUtil
                .createPageable(pageNumber, pageSize, sortField, sortType, BookResponse.class);

        Page<Book> page;
        if (searchRequest != null && !searchRequest.trim().isEmpty()) {
            page = bookRepository.searchByFields(searchRequest, pageable);
        } else {
            page = bookRepository.findAll(pageable);
        }

        List<BookResponse> books = page.getContent().stream()
                .map(book -> modelMapper.map(book, BookResponse.class))
                .toList();

        return PageResponse.<BookResponse>builder()
                .objectList(books)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    public BookResponse getBookById(UUID id) {
        Book book = getOrThrow(id);
        log.info(LogList.LOG_GET_BOOK, id);
        return modelMapper.map(book, BookResponse.class);
    }

    @Transactional
    @Override
    public BookResponse createBook(
            BookRequest createBookRequest, MultipartFile image, MultipartFile[] additionalImages) {
        if (bookRepository.existsByIsbn(createBookRequest.getIsbn())) {
            throw new BookAlreadyExistsException();
        }

        createBookRequest.setImageLink(imageService.uploadAndGetImgurUrl(image));

        Book savedBook = bookRepository.save(modelMapper.map(createBookRequest, Book.class));
        log.info(LogList.LOG_CREATE_BOOK, savedBook.getId());

        if (additionalImages != null && additionalImages.length > 0) {
            savedBook.setAdditionalImages(
                    imageService.saveAdditionalImagesToDatabase(savedBook.getId(), additionalImages));
        }

        BookResponse savedBookResponse = modelMapper.map(bookRepository.save(savedBook), BookResponse.class);

        if (savedBook.getAdditionalImages() != null) {
            savedBookResponse.setAdditionalImagesLinks(savedBook.getAdditionalImages()
                    .stream()
                    .map(Image::getLink)
                    .toList());
        }

        return savedBookResponse;
    }

    @Override
    public void removeBook(UUID id) {
        bookRepository.delete(getOrThrow(id));
        log.info(LogList.LOG_DELETE_BOOK, id);
    }

    @Transactional
    @Override
    public BookResponse editBook(
            UUID id,
            BookRequest editBookRequest,
            MultipartFile image,
            MultipartFile[] additionalImages) {

        if (!getOrThrow(id).getIsbn().equals(editBookRequest.getIsbn())
                && bookRepository.existsByIsbn(editBookRequest.getIsbn())) {
            throw new BookAlreadyExistsException();
        }

        if (editBookRequest.getImageLink() == null && image == null) {
            throw new ImageRequiredException();
        }

        Book editingBook = modelMapper.map(editBookRequest, Book.class);
        editingBook.setId(id);

        editingBook.setImageLink(image != null
                ? imageService.uploadAndGetImgurUrl(image)
                : editBookRequest.getImageLink());

        imageService.removeImagesByBookId(id);
        Set<Image> booksAdditionalImages = new HashSet<>();
        if (!editBookRequest.getAdditionalImagesLinks().isEmpty()) {
            booksAdditionalImages.addAll(
                    imageService.saveAdditionalImagesByLinks(id, editBookRequest.getAdditionalImagesLinks())
            );
        }

        if (additionalImages != null && additionalImages.length > 0) {
            booksAdditionalImages.addAll(
                    imageService.saveAdditionalImagesToDatabase(id, additionalImages)
            );
        }

        editingBook.setAdditionalImages(booksAdditionalImages);

        Book savedBook = bookRepository.save(editingBook);
        log.info(LogList.LOG_EDIT_BOOK, id);


        BookResponse savedBookResponse = modelMapper.map(bookRepository.save(savedBook), BookResponse.class);
        savedBookResponse.setAdditionalImagesLinks(savedBook.getAdditionalImages()
                .stream()
                .map(Image::getLink)
                .toList());

        return savedBookResponse;
    }

    @Override
    public BookResponse sellBook(BookSellRequest bookSellRequest) {
        Book sellingBook = getOrThrow(bookSellRequest.getBookId());

        sellingBook.setAmount(sellingBook.getAmount() - bookSellRequest.getAmount());

        return modelMapper.map(bookRepository.save(sellingBook), BookResponse.class);
    }

    @Override
    public List<BookResponse> getBooksByAuthor(String authorName) {
        return bookRepository.findBooksByAuthor(authorName)
                .stream()
                .map(book -> modelMapper.map(book, BookResponse.class))
                .toList();
    }

    @Override
    public List<BookResponse> getBooksByGenre(String genreName) {
        return bookRepository.findBooksByGenre(genreName)
                .stream()
                .map(book -> modelMapper.map(book, BookResponse.class))
                .toList();
    }

    private Book getOrThrow(UUID id) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        return optionalBook.orElseThrow(BookNotFoundException::new);
    }
}
