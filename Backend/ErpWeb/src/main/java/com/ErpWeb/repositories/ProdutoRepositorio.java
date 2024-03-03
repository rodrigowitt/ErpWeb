package com.ErpWeb.repositories;

import com.ErpWeb.model.ProdutoModelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepositorio extends JpaRepository<ProdutoModelo, Long> {
}
