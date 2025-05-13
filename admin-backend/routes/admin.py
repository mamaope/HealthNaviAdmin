import uuid
import json
import traceback
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from database.db import get_db

router = APIRouter()

class PractitionerIds(BaseModel):
    practitioner_ids: List[str]

@router.post("/patients")
async def get_patients(ids: PractitionerIds, db: AsyncSession = Depends(get_db)):
    """
    Fetches patients associated with a list of practitioner IDs.
    """
    try:
        if not ids.practitioner_ids:
            return []

        query = text("""
            SELECT patient_id, gender, age, practitioner_id, created_at
            FROM patients
            WHERE practitioner_id = ANY(:ids)
            ORDER BY created_at DESC
        """)
        result = await db.execute(query, {"ids": ids.practitioner_ids})
        rows = result.mappings().all()
        return list(rows)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching patients: {str(e)}")

@router.post("/diagnoses")
async def get_diagnoses(ids: PractitionerIds, db: AsyncSession = Depends(get_db)):
    """
    Fetches diagnoses associated with a list of practitioner IDs.
    """
    try:
        if not ids.practitioner_ids:
            return []

        query = text("""
            SELECT diagnosis_id, patient_id, practitioner_id, age, gender,
                   respiratory_rate, oxygen_saturation, height, weight, heart_rate,
                   temperature, lung_sound, presenting_symptoms, diagnosis_summary, doctor_notes,
                   chat_history, status, diagnosis_date, created_at, updated_at
            FROM diagnoses
            WHERE practitioner_id = ANY(:ids)
            ORDER BY diagnosis_date DESC
        """)
        result = await db.execute(query, {"ids": tuple(ids.practitioner_ids)})
        rows = result.mappings().all()

        formatted_diagnoses = []
        for row in rows:
            diagnosis = dict(row)
            try:
                diagnosis["chat_history"] = json.loads(diagnosis.get("chat_history", "null")) if diagnosis.get("chat_history") else []
            except json.JSONDecodeError:
                 print(f"Warning: Could not parse chat_history for diagnosis_id {diagnosis.get('diagnosis_id')}")
                 diagnosis["chat_history"] = [] 

            if isinstance(diagnosis.get("diagnosis_id"), uuid.UUID):
                 diagnosis["diagnosis_id"] = str(diagnosis["diagnosis_id"])

            formatted_diagnoses.append(diagnosis)

        return formatted_diagnoses
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching diagnoses: {str(e)}")

@router.get("/diagnoses/patient/{patient_id}")
async def get_diagnoses_by_patient(
    patient_id: str = Path(..., description="The ID of the patient"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetches all diagnoses for a specific patient ID.
    """
    try:
        query = text("""
            SELECT diagnosis_id, patient_id, practitioner_id, age, gender,
                   respiratory_rate, oxygen_saturation, height, weight, heart_rate,
                   temperature, lung_sound, presenting_symptoms, diagnosis_summary, doctor_notes,
                   chat_history, status, diagnosis_date, created_at, updated_at
            FROM diagnoses
            WHERE patient_id = :patient_id
            ORDER BY diagnosis_date DESC
        """)
        result = await db.execute(query, {"patient_id": patient_id})
        rows = result.mappings().all()

        formatted_diagnoses = []
        for row in rows:
            diagnosis = dict(row)
            try:
                diagnosis["chat_history"] = json.loads(diagnosis.get("chat_history", "null")) if diagnosis.get("chat_history") else []
            except json.JSONDecodeError:
                 print(f"Warning: Could not parse chat_history for diagnosis_id {diagnosis.get('diagnosis_id')}")
                 diagnosis["chat_history"] = [] 

            if isinstance(diagnosis.get("diagnosis_id"), uuid.UUID):
                 diagnosis["diagnosis_id"] = str(diagnosis["diagnosis_id"])

            formatted_diagnoses.append(diagnosis)

        return formatted_diagnoses
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching patient diagnoses: {str(e)}")

@router.get("/diagnoses/{diagnosis_id}")
async def get_diagnosis_by_id(
    diagnosis_id: str = Path(..., description="The ID of the diagnosis"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetches a single diagnosis by its ID.
    """
    try:
        query = text("""
            SELECT diagnosis_id, patient_id, practitioner_id, age, gender,
                   respiratory_rate, oxygen_saturation, height, weight, heart_rate,
                   temperature, lung_sound, presenting_symptoms, diagnosis_summary, doctor_notes,
                   chat_history, status, diagnosis_date, created_at, updated_at
            FROM diagnoses
            WHERE diagnosis_id = :diagnosis_id
        """)
        result = await db.execute(query, {"diagnosis_id": diagnosis_id})
        row = result.mappings().first()

        if not row:
            raise HTTPException(status_code=404, detail="Diagnosis not found")

        diagnosis = dict(row)
        try:
            diagnosis["chat_history"] = json.loads(diagnosis.get("chat_history", "null")) if diagnosis.get("chat_history") else []
        except json.JSONDecodeError:
            print(f"Warning: Could not parse chat_history for diagnosis_id {diagnosis_id}")
            diagnosis["chat_history"] = []

        if isinstance(diagnosis.get("diagnosis_id"), uuid.UUID):
            diagnosis["diagnosis_id"] = str(diagnosis["diagnosis_id"])

        return diagnosis
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching diagnosis: {str(e)}")

@router.post("/stats")
async def get_stats(ids: PractitionerIds, db: AsyncSession = Depends(get_db)):
    """
    Fetches statistics based on a list of practitioner IDs.
    Includes total patients, total diagnoses, diagnosis status counts, and practitioner count.
    """
    try:
        if not ids.practitioner_ids:
             return {
                "total_patients": 0,
                "total_diagnoses": 0,
                "status_counts": {"in_progress": 0, "paused": 0, "complete": 0, "critical": 0},
                "total_practitioners": 0
            }

        patients_query = text("""
            SELECT COUNT(DISTINCT patient_id) FROM patients
            WHERE practitioner_id = ANY(:ids)
        """)
        total_patients_result = await db.execute(patients_query, {"ids": ids.practitioner_ids})
        total_patients = total_patients_result.scalar_one_or_none() or 0

        diagnoses_query = text("""
            SELECT COUNT(*) FROM diagnoses
            WHERE practitioner_id = ANY(:ids)
        """)
        total_diagnoses_result = await db.execute(diagnoses_query, {"ids": tuple(ids.practitioner_ids)})
        total_diagnoses = total_diagnoses_result.scalar_one_or_none() or 0

        status_query = text("""
            SELECT status, COUNT(*) FROM diagnoses
            WHERE practitioner_id = ANY(:ids)
            GROUP BY status
        """)
        status_result = await db.execute(status_query, {"ids": tuple(ids.practitioner_ids)})
        status_rows = status_result.all()

        status_counts = {"in_progress": 0, "paused": 0, "complete": 0, "critical": 0}
        for status, count in status_rows:
             if status in status_counts: 
                status_counts[status] = count

        total_practitioners = len(set(ids.practitioner_ids))

        return {
            "total_patients": total_patients,
            "total_diagnoses": total_diagnoses,
            "status_counts": status_counts,
            "total_practitioners": total_practitioners
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

@router.get("/practitioner/validate/{practitioner_id}")
async def validate_practitioner(
    practitioner_id: str = Path(..., description="The ID of the practitioner to validate"),
    db: AsyncSession = Depends(get_db)
):
    """
    Validates if a practitioner ID exists in the database.
    """
    try:
        query = text("""
            SELECT EXISTS (
                SELECT 1 FROM (
                    SELECT practitioner_id FROM patients WHERE practitioner_id = :id
                    UNION
                    SELECT practitioner_id FROM diagnoses WHERE practitioner_id = :id
                ) AS combined_check
            ) as exists;
        """)
        
        result = await db.execute(query, {"id": practitioner_id})
        exists = result.scalar()
        
        return {"exists": bool(exists)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
