package com.backend.springjwt.controllers;

import org.springframework.security.access.prepost.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/content")
public class ContentsController {

  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/personalorders")
  @PreAuthorize("hasRole('USER')")
  public String personalOrders() {
    return "Personal Orders";
  }

  @GetMapping("/createorder")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public String createOrder() {
    return "Create Order";
  }

  @GetMapping("/manageorders")
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  public String manageOrders() {
    return "Manage Orders";
  }

  @GetMapping("/manageusers")
  @PreAuthorize("hasRole('ADMIN')")
  public String manageUsers() {
    return "Manage Users";
  }
}