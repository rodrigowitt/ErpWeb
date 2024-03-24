package com.ErpWeb.repositories;

import com.ErpWeb.model.ClienteModelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepositorio extends JpaRepository<ClienteModelo, Long> {
}
