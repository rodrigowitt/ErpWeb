package com.ErpWeb.dto;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ItensPedidoDto {
    @Id
    private Long produto_id;

    @NotNull
    private Double preco;
    @NotNull
    private Long pedido;

    private String produto;

    private String quantidade;

    public Long getproduto_id() {
        return produto_id;
    }

    public void setproduto_id(Long pedido_id) {
        this.produto_id = pedido_id;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Long getPedido() {
        return pedido;
    }

    public void setPedido(Long pedido) {
        this.pedido = pedido;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }

    public String getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(String quantidade) {
        this.quantidade = quantidade;
    }
}
