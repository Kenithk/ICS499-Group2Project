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
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

  //Used in the searchUsers() method
    public static boolean isNumeric(String str) {
        try {
          Long.parseLong(str);
          return true;
        } catch (NumberFormatException e) {
          return false;
        }
      }

    //Working
    @GetMapping("/users/getAll")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
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

    @GetMapping("/users/search/{data}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@PathVariable("data") String data) {
        ResponseEntity<List<User>> users = null;
        ResponseEntity<List<User>> notFound = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        if (data.equals(null)) {
            List<User> _users = new ArrayList<>();
            userRepository.findAll().forEach(_users::add);
            return new ResponseEntity<>(_users, HttpStatus.OK);
        }
        if (isNumeric(data)) {
            if (data.length() == 4) {
                //Search by User ID
                users = getUserById(Long.valueOf(data));
                if (users.equals(notFound)) {
                    return notFound;
                }
            }
            return users;
            }
        if (!isNumeric(data)) {
                try {
                    //Search by Username
                    users = getUserByUsername(data);
                    if (users.equals(notFound)) {
                        //Search by Email
                        users = getUserByEmail(data);
                        if (users.equals(notFound)) {
                            return notFound;
                            }
                        }
                    } catch (Exception e) {
                        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                }
        return users;
        }

    //Working
    @GetMapping("/users/get/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUserById(@PathVariable("id") Long id) {
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
    public ResponseEntity<List<User>> getUserByUsername(@PathVariable("username") String username) {
        try {
            List<User> users = userRepository.findByUsernameContaining(username);
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(users, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @GetMapping("/users/get/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUserByEmail(@PathVariable("email") String email) {
        try {
            List<User> users = userRepository.findByEmailContaining(email);
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(users, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    //Working
    @GetMapping("/users/refresh/{id}")
    public ResponseEntity<User> refreshUser(@PathVariable("id") Long id) {
        try {
            Optional<User> _user = userRepository.findById(id);
            if (_user.isPresent()) {
                User freshUser = _user.get();
                return new ResponseEntity<>(freshUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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
    @PutMapping("/users/clearnotifications/{id}")
    public ResponseEntity<User> clearNotifications(@PathVariable("id") String id) {
        Optional<User> userData = userRepository.findById(Long.valueOf(id));
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setZeroNotifications();
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Working
    @PutMapping("/users/setuser/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> setUser(@PathVariable("id") Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);
        Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);
        Set<Role> roles = new HashSet<>();
        roles.add(userRole.get());
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setRoles(roles);
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Working
    @PutMapping("/users/setmod/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> setMod(@PathVariable("id") Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);
        Optional<Role> modRole = roleRepository.findByName(ERole.ROLE_MODERATOR);
        Set<Role> roles = new HashSet<>();
        roles.add(modRole.get());
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setRoles(roles);
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Working
    @PutMapping("/users/setadmin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> setAdmin(@PathVariable("id") Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);
        Optional<Role> adminRole = roleRepository.findByName(ERole.ROLE_ADMIN);
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole.get());
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setRoles(roles);
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