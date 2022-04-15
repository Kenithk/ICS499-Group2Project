package com.backend.springjwt.models;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roleid_generator")
  @SequenceGenerator(name = "roleid_generator", initialValue = 100, allocationSize = 1, sequenceName = "roleid_seq")
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ERole name;

  public Role() {
  }

  public Role(ERole name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public ERole getName() {
    return name;
  }

  public void setName(ERole name) {
    this.name = name;
  }

  public ERole getUserRole() {
      return ERole.ROLE_USER;
  }

  public ERole getModRole() {
      return ERole.ROLE_MODERATOR;
  }

  public ERole getAdminRole() {
      return ERole.ROLE_ADMIN;
  }
}