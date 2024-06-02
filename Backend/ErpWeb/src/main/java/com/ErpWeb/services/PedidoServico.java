package com.ErpWeb.services;


import com.ErpWeb.dto.VendasDiarias;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.repositories.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;


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

    public BigDecimal vendasDia() {
        String sql = "SELECT cast(sum(total) as numeric(10,2)) as total\n" +
                "FROM tb_pedido\n" +
                "WHERE entrada >= current_date\n" +
                " AND entrada < current_date + INTERVAL '1 day';\n";

        return jdbcTemplate.queryForObject(sql, BigDecimal.class);
    }

    public BigInteger pedidosMes() {
        String sql = "SELECT count(*) as total\n" +
                "FROM tb_pedido\n" +
                "WHERE entrada >= date_trunc('month', current_date)\n" +
                "  AND entrada < (date_trunc('month', current_date) + interval '1 month');";

        return jdbcTemplate.queryForObject(sql, BigInteger.class);
    }

    public BigInteger pedidosDiario() {
        String sql = "SELECT count(*) as total \n" +
                "FROM tb_pedido\n" +
                "WHERE entrada >= date_trunc('day', current_date)\n" +
                "AND entrada < (date_trunc('day', current_date) + interval '1 day');";

        return jdbcTemplate.queryForObject(sql, BigInteger.class);
    }

    public BigInteger clientesMes() {
        String sql = "select count(*) as total\n" +
                "from tb_cliente\n" +
                "WHERE data_cadastro >= date_trunc('month', current_date)\n" +
                " AND data_cadastro < (date_trunc('month', current_date) + interval '1 month');";

        return jdbcTemplate.queryForObject(sql, BigInteger.class);
    }

    public List<VendasDiarias> vendasSemanal() {
        LocalDate now = LocalDate.now();
        LocalDate inicioSemana = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate fimSemana = inicioSemana.plusDays(7);

        String sql = "SELECT DATE(entrada) as date, SUM(total) as total " +
                "FROM tb_pedido " +
                "WHERE entrada >= ? AND entrada < ? " +
                "GROUP BY DATE(entrada)";

        return jdbcTemplate.query(sql, new Object[]{inicioSemana, fimSemana}, new RowMapper<VendasDiarias>() {
            @Override
            public VendasDiarias mapRow(ResultSet rs, int rowNum) throws SQLException {
                LocalDate date = rs.getDate("date").toLocalDate();
                BigDecimal total = rs.getBigDecimal("total");
                return new VendasDiarias(date, total);
            }
        });
    }

}
