package com.backend.springjwt.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.*;
import org.springframework.web.bind.annotation.*;

import com.backend.springjwt.models.*;
import com.backend.springjwt.repository.*;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserRepository userRepository;

    //Working
    @GetMapping("/users/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String username) {
        try {
            List<User> users = new ArrayList<>();
            if (username == null)
                userRepository.findAll().forEach(users::add);
            else
                userRepository.findByUsernameContaining(username).forEach(users::add);
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @GetMapping("/users/get/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getByUserId(@PathVariable("id") Long id) {
        try {
            Optional<User> user = userRepository.findById(id);
            User _user = user.get();
            List<User> userAsList = new ArrayList<>();
            userAsList.add(_user);
            if (userAsList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(userAsList, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @GetMapping("/users/get/username/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getByUsername(@PathVariable("username") String username) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            User _user = user.get();
            List<User> userAsList = new ArrayList<>();
            userAsList.add(_user);
            if (userAsList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(userAsList, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @GetMapping("/users/get/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getByEmail(@PathVariable("email") String email) {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            User _user = user.get();
            List<User> userAsList = new ArrayList<>();
            userAsList.add(_user);
            if (userAsList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(userAsList, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @PutMapping("/users/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setUsername(user.getUsername());
            _user.setEmail(user.getEmail());
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Working
    @DeleteMapping("/users/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    }