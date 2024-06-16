package com.ErpWeb.services;

import com.ErpWeb.model.ClienteModelo;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.repositories.ClienteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

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


    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public List<ClienteModelo> findCustomerBySearch(String buscaCliente) {
        String sql = "SELECT * FROM tb_cliente " +
                "WHERE LOWER(cnpjoucpf) LIKE LOWER(:searchPattern) " +
                "OR LOWER(nome_fantasia) LIKE LOWER(:searchPattern) " +
                "OR LOWER(razao_social) LIKE LOWER(:searchPattern) " +
                "OR CAST(clienteid AS TEXT) LIKE :searchPattern";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("searchPattern", "%" + buscaCliente.toLowerCase() + "%");

        return namedParameterJdbcTemplate.query(sql, params, new BeanPropertyRowMapper<>(ClienteModelo.class));
    }



    public Optional<ClienteModelo> findById(Long id) {return clienteRepositorio.findById(id);}

    public void delete(ClienteModelo clienteModelo) {clienteRepositorio.delete(clienteModelo);}
}
