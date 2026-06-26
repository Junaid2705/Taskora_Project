package com.example.taskora_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BidRequest {

    // Required on submit; ignored on update (path id is used there)
    private Long projectId;

    private String proposal;

    @NotNull(message = "Bid amount is required")
    private BigDecimal bidAmount;

    private Integer deliveryDays;
}
