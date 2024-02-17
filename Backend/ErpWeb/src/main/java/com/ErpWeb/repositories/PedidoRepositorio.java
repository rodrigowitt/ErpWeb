package com.ErpWeb.repositories;

import com.ErpWeb.model.PedidoModelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepositorio extends JpaRepository<PedidoModelo, Long> {
}
