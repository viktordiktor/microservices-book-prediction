package com.nikanenka.services;

import com.nikanenka.dto.OrderRequest;
import com.nikanenka.dto.OrderResponse;
import com.nikanenka.dto.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    PageResponse<OrderResponse> getAllOrders(
            int pageNumber, int pageSize, String sortField, String sortType);

    OrderResponse getOrderById(UUID id);

    OrderResponse processOrderById(UUID orderId);

    OrderResponse createOrder(OrderRequest createOrderRequest);

    List<OrderResponse> batchFileCreateOrders(MultipartFile excelFile);

    void removeOrder(UUID id);

    List<OrderResponse> getAllOrdersByBookId(UUID bookId);

    OrderResponse editOrder(UUID id, OrderRequest editOrderRequest);
}
