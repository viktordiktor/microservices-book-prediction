package com.nikanenka.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ImgurUploader {
    public String getImgurUrl(MultipartFile file) throws IOException {
        String CLIENT_ID = "ae559801c138d8c";
        String SECRET_KEY = "168fb6c849393625075d397934d38d9a14808dc6";
        String IMGUR_API_ENDPOINT = "https://api.imgur.com/3/image";

        RestTemplate restTemplate = new RestTemplate();

        // Create a ByteArrayResource from the MultipartFile
        ByteArrayResource resource = new ByteArrayResource(file.getBytes());

        // Create a multipart request entity
        MultiValueMap<String, Object> multipartRequest = new LinkedMultiValueMap<>();
        multipartRequest.add("image", resource);

        // Set API key and secret in headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Client-ID " + CLIENT_ID);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Create a request entity
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(multipartRequest, headers);

        // Execute the request
        ResponseEntity<String> response = restTemplate.postForEntity(IMGUR_API_ENDPOINT, requestEntity, String.class);

        // Parse the JSON response
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response.getBody());

        // Get the image URL from the response
        String imageUrl = rootNode.get("data").get("link").asText();

        return imageUrl;
    }
}
