package com.ErpWeb.services;

import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.repositories.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoServico {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PedidoRepositorio pedidoRepositorio;


    public PedidoServico(PedidoRepositorio pedidoRepositorio) {
        this.pedidoRepositorio = pedidoRepositorio;
    }

    public PedidoModelo save(PedidoModelo pedidoModelo) {
        return pedidoRepositorio.save(pedidoModelo);
    }

    public List<PedidoModelo> findAll() {
        return pedidoRepositorio.findAll();
    }

    public Optional<PedidoModelo> findById(Long id) {
        return pedidoRepositorio.findById(id);
    }

    public void delete(PedidoModelo pedidoModelo) {
        pedidoRepositorio.delete(pedidoModelo);
    }
}
