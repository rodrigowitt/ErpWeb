package com.ErpWeb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_itens_pedido")
public class ItensPedidoModelo {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long itensPedidoid;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "produto_id", referencedColumnName = "produtoid")
    private ProdutoModelo produtoModelo;

    private Long pedido;

    private Double preco;

    private String produto;

    private String quantidade;

    public Long getItensPedidoid() {
        return itensPedidoid;
    }

    public void setItensPedidoid(Long itensPedidoid) {
        this.itensPedidoid = itensPedidoid;
    }

    public ProdutoModelo getProdutoModelo() {
        return produtoModelo;
    }

    public void setProdutoModelo(ProdutoModelo produtoModelo) {
        this.produtoModelo = produtoModelo;
    }

    public Long getProduto_id() {
        return produtoModelo != null ? produtoModelo.getProdutoid() : null;
    }

    public void setProduto_id(Long produto_id) {
        if (produtoModelo == null) {
            produtoModelo = new ProdutoModelo();
        }
        produtoModelo.setProdutoid(produto_id);
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

