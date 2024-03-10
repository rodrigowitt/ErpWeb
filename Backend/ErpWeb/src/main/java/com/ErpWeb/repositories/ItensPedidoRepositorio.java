package com.ErpWeb.repositories;

import com.ErpWeb.model.ItensPedidoModelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItensPedidoRepositorio extends JpaRepository<ItensPedidoModelo, Long> {
}
