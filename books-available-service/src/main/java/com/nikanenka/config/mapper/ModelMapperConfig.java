package com.nikanenka.config.mapper;

import com.nikanenka.dto.BookResponse;
import com.nikanenka.models.Book;
import com.nikanenka.models.Image;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper getModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        configureModelMapper(modelMapper);
        return modelMapper;
    }

    private void configureModelMapper(ModelMapper modelMapper) {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        modelMapper.getConfiguration().setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);

        PropertyMap<Book, BookResponse> bookMap = new PropertyMap<>() {
            protected void configure() {
                using(ctx -> {
                    @SuppressWarnings("unchecked")
                    Set<Image> images = (Set<Image>) ctx.getSource();

                    if (images == null) {
                        return Collections.emptyList();
                    }
                    return images.stream().map(Image::getLink).collect(Collectors.toList());
                }).map(source.getAdditionalImages(), destination.getAdditionalImagesLinks());
            }
        };
        modelMapper.addMappings(bookMap);
    }
}