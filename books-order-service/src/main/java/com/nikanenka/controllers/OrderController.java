package com.nikanenka.controllers;

import com.nikanenka.dto.OrderRequest;
import com.nikanenka.dto.OrderResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.services.OrderService;
import com.nikanenka.utils.ExcelUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public PageResponse<OrderResponse> getAllOrders(@RequestParam(defaultValue = "0") int pageNumber,
                                                    @RequestParam(defaultValue = "50") int pageSize,
                                                    @RequestParam(defaultValue = "id") String sortField,
                                                    @RequestParam(defaultValue = "asc") String sortType) {
        return orderService.getAllOrders(pageNumber, pageSize, sortField, sortType);
    }

    @GetMapping("/book/{bookId}")
    public List<OrderResponse> getAllOrdersByBookId(
            @PathVariable UUID bookId) {
        return orderService.getAllOrdersByBookId(bookId);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable UUID id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/process/{id}")
    public OrderResponse processOrderById(@PathVariable UUID id) {
        return orderService.processOrderById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest createOrderRequest) {
        return orderService.createOrder(createOrderRequest);
    }

    @PutMapping("/{id}")
    public OrderResponse editOrder(@PathVariable UUID id, @Valid @RequestBody OrderRequest editOrderRequest) {
        return orderService.editOrder(id, editOrderRequest);
    }

    @PostMapping(path = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<OrderResponse> batchFileCreateOrders(@RequestPart MultipartFile uploadExcelFile) {
        return orderService.batchFileCreateOrders(uploadExcelFile);
    }

    @GetMapping("/template")
    public ResponseEntity<Resource> downloadOrderTemplate() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ExcelUtil.CONTENT_DISPOSITION_HEADER)
                .contentType(MediaType.parseMediaType(ExcelUtil.MEDIA_TYPE))
                .body(new ClassPathResource(ExcelUtil.TEMPLATE_FILE_NAME));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeOrder(@PathVariable UUID id) {
        orderService.removeOrder(id);
    }
}
