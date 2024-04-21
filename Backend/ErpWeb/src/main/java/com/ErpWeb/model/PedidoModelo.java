package com.ErpWeb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name="tb_pedido")
public class PedidoModelo {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long pedidoid;

    @Column
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime entrada;

    private String cliente;

    private double desconto;

    private double total;

    private String forma_pagamento;

    private String status;

    public Long getPedidoid() {
        return pedidoid;
    }

    public void setPedidoid(Long pedidoid) {
        this.pedidoid = pedidoid;
    }

    public LocalDateTime getEntrada() {
        return entrada;
    }

    public LocalDateTime setEntrada(LocalDateTime entrada) {
        this.entrada = entrada;
        return entrada;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public double getDesconto() {
        return desconto;
    }

    public void setDesconto(double desconto) {
        this.desconto = desconto;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getForma_pagamento() {
        return forma_pagamento;
    }

    public void setForma_pagamento(String forma_pagamento) {
        this.forma_pagamento = forma_pagamento;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
