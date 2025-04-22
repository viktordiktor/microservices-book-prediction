package com.nikanenka.services.impl;

import com.nikanenka.services.PromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromptServiceImpl implements PromptService {
    private final OllamaChatModel chatModel;

    @Override
    public String generate(String promptMessage) {
        ChatResponse response = chatModel.call(new Prompt(promptMessage, OllamaOptions.builder().model("deepseek-r1:7b").build()));
        return response.getResult().getOutput().getText();
    }
}
