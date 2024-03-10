package com.ErpWeb.services;

import com.ErpWeb.model.ItensPedidoModelo;
import com.ErpWeb.repositories.ItensPedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ItensPedidoServico {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    final ItensPedidoRepositorio itensPedidoRepositorio;

    public ItensPedidoServico(ItensPedidoRepositorio itensPedidoRepositorio) {
        this.itensPedidoRepositorio = itensPedidoRepositorio;
    }

    public ItensPedidoModelo save(ItensPedidoModelo itensPedidoModelo) {
    return itensPedidoRepositorio.save(itensPedidoModelo);}

    public List<ItensPedidoModelo> findAll() { return itensPedidoRepositorio.findAll();}

    public Optional<ItensPedidoModelo> findById(Long id) {return itensPedidoRepositorio.findById(id);}

    public void delete(ItensPedidoModelo itensPedidoModelo) { itensPedidoRepositorio.delete(itensPedidoModelo);}
}
