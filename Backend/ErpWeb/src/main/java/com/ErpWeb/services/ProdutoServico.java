package com.ErpWeb.services;

import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.repositories.ProdutoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class ProdutoServico {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ProdutoRepositorio produtoRepositorio;

    public ProdutoServico(ProdutoRepositorio produtoRepositorio){ this.produtoRepositorio = produtoRepositorio;}

    public ProdutoModelo save(ProdutoModelo produtoModelo) {
        return produtoRepositorio.save(produtoModelo);
    }

    public List<ProdutoModelo> findAll() {
        return produtoRepositorio.findAll();
    }

    public Optional<ProdutoModelo> findById(Long id) {
        return produtoRepositorio.findById(id);
    }

    public Optional<ProdutoModelo> findByCodigo(String codigo) {
        return produtoRepositorio.findByCodigo(codigo);
    }


    public void delete(ProdutoModelo produtoModelo) {
        produtoRepositorio.delete(produtoModelo);
    }

    public List<ProdutoModelo> findProdutoBySearch(String codigoProduto){
        String sql = "Select * From tb_produto where codigo like '%" + codigoProduto + "%' or nome like '%" + codigoProduto + "%'";

        List <ProdutoModelo> resultado = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProdutoModelo.class));

        return resultado;
    }
}
