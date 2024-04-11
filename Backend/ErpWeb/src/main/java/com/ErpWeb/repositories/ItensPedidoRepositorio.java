package com.ErpWeb.repositories;

import com.ErpWeb.model.ItensPedidoModelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItensPedidoRepositorio extends JpaRepository<ItensPedidoModelo, Long> {
    List<ItensPedidoModelo> findByPedido(Long pedido);
}
