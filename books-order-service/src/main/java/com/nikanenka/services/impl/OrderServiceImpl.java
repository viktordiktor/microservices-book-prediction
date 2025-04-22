package com.nikanenka.services.impl;

import com.nikanenka.config.repositories.OrderRepository;
import com.nikanenka.dto.OrderRequest;
import com.nikanenka.dto.OrderResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.feign.BookOrderRequest;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.exceptions.OrderNotFoundException;
import com.nikanenka.models.Order;
import com.nikanenka.services.OrderService;
import com.nikanenka.services.feign.BookService;
import com.nikanenka.utils.ExcelUtil;
import com.nikanenka.utils.LogList;
import com.nikanenka.utils.PageUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<OrderResponse> getAllOrders(
            int pageNumber, int pageSize, String sortField, String sortType) {
        Pageable pageable = PageUtil
                .createPageable(pageNumber, pageSize, sortField, sortType, OrderResponse.class);

        Page<Order> page = orderRepository.findAll(pageable);

        List<OrderResponse> sells = page.getContent().stream()
                .map(sell -> modelMapper.map(sell, OrderResponse.class))
                .toList();
        sells.forEach(sell -> {
            BookResponse bookResponse = bookService.getBookById(sell.getBookId());
            if (bookResponse.getErrorMessage() == null) {
                sell.setBookTitle(bookResponse.getTitle());
            }
        });

        return PageResponse.<OrderResponse>builder()
                .objectList(sells)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    public OrderResponse getOrderById(UUID id) {
        Order sell = getOrThrow(id);
        log.info(LogList.LOG_GET_ORDER, id);
        return modelMapper.map(sell, OrderResponse.class);
    }

    @Override
    public OrderResponse createOrder(OrderRequest createOrderRequest) {
        Order order = modelMapper.map(createOrderRequest, Order.class);
        order.setCompleted(false);
        order.setCreatedDate(LocalDate.now());
        return modelMapper.map(orderRepository.save(order), OrderResponse.class);
    }

    @Override
    public OrderResponse editOrder(UUID id, OrderRequest editOrderRequest) {
        Order order = getOrThrow(id);
        order.setAmount(editOrderRequest.getAmount());
        order.setOrderLeadTime(editOrderRequest.getOrderLeadTime());
        order.setBookId(editOrderRequest.getBookId());
        return modelMapper.map(orderRepository.save(order), OrderResponse.class);
    }

    @Override
    public List<OrderResponse> batchFileCreateOrders(MultipartFile excelFile) {
        return ExcelUtil.readOrdersFromExcel(excelFile).stream()
                .map(order -> modelMapper.map(orderRepository.save(order), OrderResponse.class))
                .toList();
    }

    @Override
    public OrderResponse processOrderById(UUID orderId) {
        Order order = getOrThrow(orderId);
        bookService.orderBook(BookOrderRequest.builder().bookId(order.getBookId()).amount(order.getAmount()).build());
        order.setCompleteDate(LocalDate.now());
        order.setCompleted(true);
        return modelMapper.map(orderRepository.save(order), OrderResponse.class);
    }

    @Override
    public void removeOrder(UUID id) {
        orderRepository.delete(getOrThrow(id));
        log.info(LogList.LOG_DELETE_ORDER, id);
    }

    @Override
    public List<OrderResponse> getAllOrdersByBookId(UUID bookId) {
        return orderRepository.findOrdersByBookId(bookId)
                .stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .toList();
    }

    private Order getOrThrow(UUID id) {
        Optional<Order> optionalOrdering = orderRepository.findById(id);
        return optionalOrdering.orElseThrow(OrderNotFoundException::new);
    }
}
