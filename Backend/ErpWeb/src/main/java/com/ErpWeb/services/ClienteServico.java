package com.ErpWeb.services;

import com.ErpWeb.model.ClienteModelo;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.repositories.ClienteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteServico {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public ClienteServico(ClienteRepositorio clienteRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
    }

    public ClienteModelo  save(ClienteModelo clienteModelo) {
        return clienteRepositorio.save(clienteModelo);
    }

    public List<ClienteModelo> findAll() { return clienteRepositorio.findAll();
    }

    public List<ClienteModelo> findAllOrderbyAsc()
    {
        String sql = "select * from tb_cliente order by 1 asc";

        List <ClienteModelo> resultado = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ClienteModelo.class));
        return resultado;
    };
    public Optional<ClienteModelo> findById(Long id) {return clienteRepositorio.findById(id);}

    public void delete(ClienteModelo clienteModelo) {clienteRepositorio.delete(clienteModelo);}
}
