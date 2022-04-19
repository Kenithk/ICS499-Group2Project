package com.backend.springjwt.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.*;
import org.springframework.web.bind.annotation.*;

import com.backend.springjwt.models.*;
import com.backend.springjwt.repository.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;

    //Used in the searchOrders() method
    public static boolean isNumeric(String str) {
        try {
          Long.parseLong(str);
          return true;
        } catch (NumberFormatException e) {
          return false;
        }
      }

    @GetMapping("/orders/getAll")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String title) {
        try {
            List<Order> orders = new ArrayList<>();
            if (title == null)
                orderRepository.findAll().forEach(orders::add);
            else
                orderRepository.findByTitleContaining(title).forEach(orders::add);
            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @GetMapping("/orders/search/{data}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> searchOrders(@PathVariable("data") String data) {
        ResponseEntity<List<Order>> orders = null;
        ResponseEntity<List<Order>> notFound = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        if (data.equals(null)) {
            List<Order> _orders = new ArrayList<>();
            orderRepository.findAll().forEach(_orders::add);
            return new ResponseEntity<>(_orders, HttpStatus.OK);
        }
        if (isNumeric(data)) {
            if (data.length() == 5) {
                //Search by Order ID
                orders = getOrderById(Long.valueOf(data));
                if (orders.equals(notFound)) {
                    return notFound;
                }
            }
            if (data.length() == 4) {
                //Search by User ID
                orders = getOrderByUserId(data);
                if (orders.equals(notFound)) {
                    return notFound;
                }
            }
            return orders;
            }
        if (!isNumeric(data)) {
                try {
                    //Search by Title
                    orders = getOrderByTitle(data);
                    if (orders.equals(notFound)) {
                        //Search by Description
                        orders = getOrderByDescription(data);
                        if (orders.equals(notFound)) {
                            //Search by Completed
                            orders = getOrderByCompleted(data);
                            if (orders.equals(notFound)) {
                                return notFound;
                                }
                            }
                        }
                    } catch (Exception e) {
                        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                }
        return orders;
        }

    @GetMapping("/orders/get/id/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> getOrderById(@PathVariable("id") Long id) {
        try {
            Optional<Order> order = orderRepository.findById(id);
            Order _order = order.get();
            List<Order> orderAsList = new ArrayList<>();
            orderAsList.add(_order);
            if (orderAsList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orderAsList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Added by Nicolas - working fine
    @GetMapping("/orders/get/title/{title}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> getOrderByTitle(@PathVariable("title") String title) {
        try {
            List<Order> orders = orderRepository.findByTitleContaining(title);
            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Addded by Nicolas - working fine
    @GetMapping("/orders/get/description/{description}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> getOrderByDescription(@PathVariable("description") String description) {
        try {
            List<Order> orders = orderRepository.findByDescriptionContaining(description);
            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
    }

    @GetMapping("/orders/get/completed/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<Order>> getOrderByCompleted(@PathVariable("status") String status) {
        List<Order> orders = new ArrayList<>();
        if (status.equals("Completed") || status.equals("completed")) {
            try {
                orders = orderRepository.findByCompleted(true);
                if (orders.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {
                    return new ResponseEntity<>(orders, HttpStatus.OK);
                }
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
            }
        if (status.equals("Pending") || status.equals("pending")) {
            try {
                orders = orderRepository.findByCompleted(false);
                if (orders.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {
                    return new ResponseEntity<>(orders, HttpStatus.OK);
                }
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
            }
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(orders, HttpStatus.OK);
            }
        }

    //Added by Nicolas - working fine
    @GetMapping("/orders/get/userid/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
    public ResponseEntity<List<Order>> getOrderByUserId(@PathVariable("id") String id) {
        try {
            List<Order> orders = orderRepository.findByUserId(id);
            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @PostMapping("/orders/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order _order = orderRepository
                    .save(new Order(order.getTitle(), order.getDescription(), false, order.getUserId()));
            Optional<User> user  = userRepository.findById(Long.valueOf(order.getUserId()));
            if (user.isPresent()) {
                User _user = user.get();
                _user.increaseNotifications();
                userRepository.save(_user);
            }
            return new ResponseEntity<>(_order, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @PutMapping("/orders/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Order> updateOrder(@PathVariable("id") Long id, @RequestBody Order order) {
        Optional<Order> orderData = orderRepository.findById(id);
        if (orderData.isPresent()) {
            Order _order = orderData.get();
            _order.setTitle(order.getTitle());
            _order.setDescription(order.getDescription());
            _order.setCompleted(order.isCompleted());
            _order.setUserId(order.getUserId());
            return new ResponseEntity<>(orderRepository.save(_order), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

    @DeleteMapping("/orders/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<HttpStatus> deleteOrder(@PathVariable("id") Long id) {
        try {
            orderRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @DeleteMapping("/orders/deleteAll")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<HttpStatus> deleteAllOrders() {
        try {
            orderRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
}