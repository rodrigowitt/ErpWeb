package com.ErpWeb.services;

import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.repositories.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
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

    public List<PedidoModelo> findBySearch(String numeroPedido, String numeroCliente){
        String sql = "Select * From tb_pedido";

        if (!numeroPedido.isEmpty() || !numeroCliente.isEmpty()){


            if (!numeroPedido.equals("0")){
                sql += " Where pedidoid = '" + numeroPedido + "'";
            }

            if (!numeroCliente.equals(0)){
                if (!numeroPedido.equals("0")){
                    sql += " and cliente = '" + numeroCliente + "'";
                }else{
                    sql += " where cliente = '" + numeroCliente + "'";
                }

            }
            if (numeroCliente.equals("0") && !numeroPedido.equals("0")){
                sql = "Select * From tb_pedido where pedidoid = '" + numeroPedido + "'";
            }
            if (numeroCliente.equals("0") && numeroPedido.equals("0")){
                sql = "Select * From tb_pedido";
                System.out.println("Executando o sql:" + sql);
            }


        }
        List <PedidoModelo> resultado = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PedidoModelo.class));

        return resultado;
    }
}
