package com.group2.Project.controller;

import com.group2.Project.model.Patient;
import com.group2.Project.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @PostMapping("/add")
    public String add(@RequestBody Patient patient) {
        patientService.savePatient(patient);
        return "New patient user created";
    }

    @GetMapping("/getAll")
    public List<Patient> getAllPatient() {
        return patientService.getAllPatients();
    }
}
