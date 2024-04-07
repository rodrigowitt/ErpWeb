package com.ErpWeb.control;

import com.ErpWeb.dto.ClienteDto;
import com.ErpWeb.dto.PedidoDto;
import com.ErpWeb.model.ClienteModelo;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.services.ClienteServico;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/cliente")
public class ClienteControle {
    @Autowired
    private ClienteServico clienteServico;

    @PostMapping
    public ResponseEntity<Object> saveCliente(
            @RequestBody
            @Valid
            ClienteDto clienteDto){
        var clienteModelo = new ClienteModelo();
        BeanUtils.copyProperties(clienteDto, clienteModelo);
        clienteModelo.setDataCadastro(LocalDateTime.from(LocalDateTime.now()));
        clienteModelo.setStatus(1);

        return ResponseEntity.status(HttpStatus.CREATED).body(clienteServico.save(clienteModelo));
    }

    @GetMapping
    public ResponseEntity<List<ClienteModelo>> todosClientes(){
        return ResponseEntity.status(HttpStatus.OK).body(clienteServico.findAllOrderbyAsc());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> editarCliente(@PathVariable(value = "id")Long id, @RequestBody @Valid ClienteDto clienteDto){

        Optional<ClienteModelo> clienteModeloOptional = clienteServico.findById(id);

        if (!clienteModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado");
        }
        var clienteModelo = clienteModeloOptional.get();

        BeanUtils.copyProperties(clienteDto, clienteModelo);


        return ResponseEntity.status(HttpStatus.OK).body(clienteServico.save(clienteModelo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarCliente(@PathVariable(value = "id")Long id){
        Optional<ClienteModelo> clienteModeloOptional = clienteServico.findById(id);
        if (!clienteModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else {
            clienteServico.delete(clienteModeloOptional.get());
            return  ResponseEntity.status(HttpStatus.OK).body("");
        }
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Object> getIdCliente(@PathVariable(value = "id") Long id){
        Optional<ClienteModelo> clienteModeloOptional = clienteServico.findById(id);
        if (!clienteModeloOptional.isPresent()){
            return  ResponseEntity.status(HttpStatus.OK).body(new HashMap<>());
        }
        return ResponseEntity.status(HttpStatus.OK).body(clienteModeloOptional.get());
    }
}
