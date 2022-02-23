package com.group2.Project.service;

import com.group2.Project.model.Patient;

import java.util.List;

public interface PatientService {
    public Patient savePatient(Patient patient);
    public List<Patient> getAllPatients();
}
