package com.ErpWeb.services;

import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.repositories.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.Month;
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

    public List<PedidoModelo> findBySearch(String numeroPedido, String cliente, String dataInicio, String dataFim) {
        // Substituir '&' por '/' em dataInicio e dataFim
        dataInicio = dataInicio.replace("&", "/");
        dataFim = dataFim.replace("&", "/");

        // Construir a consulta SQL básica
        StringBuilder sql = new StringBuilder("SELECT * FROM tb_pedido");

        // Construir a cláusula WHERE conforme os parâmetros fornecidos
        boolean hasWhereClause = false;

        if (!numeroPedido.isEmpty() && !numeroPedido.equals("0")) {
            sql.append(" WHERE pedidoid = '").append(numeroPedido).append("'");
            hasWhereClause = true;
        }

        if (!cliente.isEmpty() && !cliente.equals("0")) {
            sql.append(hasWhereClause ? " AND" : " WHERE")
                    .append(" cliente LIKE '%").append(cliente).append("%'");
            hasWhereClause = true;
        }

        if (!dataInicio.isEmpty() && !dataInicio.equals("0")) {
            sql.append(hasWhereClause ? " AND" : " WHERE")
                    .append(" entrada >= '").append(dataInicio).append("'");
            hasWhereClause = true;
        }

        if (!dataFim.isEmpty() && !dataFim.equals("0")) {
            sql.append(hasWhereClause ? " AND" : " WHERE")
                    .append(" entrada <= '").append(dataFim).append("'");
            hasWhereClause = true;
        }

        // Se nenhum critério de pesquisa foi fornecido, retornar todos os pedidos
        if (!hasWhereClause) {
            sql = new StringBuilder("SELECT * FROM tb_pedido");
        }

        // Executar a consulta SQL e retornar o resultado
        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(PedidoModelo.class));
    }

    public BigDecimal vendasMes() {
        String sql = "SELECT cast(sum(total) as numeric(10,2)) as total " +
                "FROM tb_pedido " +
                "WHERE entrada >= date_trunc('month', current_date) " +
                "AND entrada < (date_trunc('month', current_date) + interval '1 month')";

        return jdbcTemplate.queryForObject(sql, BigDecimal.class);
    }

    public BigInteger pedidosMes() {
        String sql = "SELECT count(*) as total\n" +
                "FROM tb_pedido\n" +
                "WHERE entrada >= date_trunc('month', current_date)\n" +
                "  AND entrada < (date_trunc('month', current_date) + interval '1 month');";

        return jdbcTemplate.queryForObject(sql, BigInteger.class);
    }

    public BigInteger clientesMes() {
        String sql = "select count(*) as total\n" +
                "from tb_cliente\n" +
                "WHERE data_cadastro >= date_trunc('month', current_date)\n" +
                " AND data_cadastro < (date_trunc('month', current_date) + interval '1 month');";

        return jdbcTemplate.queryForObject(sql, BigInteger.class);
    }

}
