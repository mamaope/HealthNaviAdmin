import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from database.db import get_db
import traceback

router = APIRouter()

class PractitionerIds(BaseModel):
    practitioner_ids: List[str]

@router.post("/patients")
async def get_patients(ids: PractitionerIds, db: AsyncSession = Depends(get_db)):
    try:
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
    try:
        query = text("""
            SELECT diagnosis_id, patient_id, practitioner_id, age, gender,
                   respiratory_rate, oxygen_saturation, height, weight, heart_rate,
                   temperature, presenting_symptoms, diagnosis_summary, doctor_notes,
                   chat_history, status, diagnosis_date, created_at
            FROM diagnoses
            WHERE practitioner_id = ANY(:ids)
            ORDER BY diagnosis_date DESC
        """)    
        result = await db.execute(query, {"ids": tuple(ids.practitioner_ids)})
        rows = result.mappings().all()
        formatted_diagnoses = []
        for row in rows:
            diagnosis = dict(row)
            diagnosis["chat_history"] = json.loads(diagnosis["chat_history"]) if diagnosis["chat_history"] else []
            formatted_diagnoses.append(diagnosis)
        return formatted_diagnoses
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching diagnoses: {str(e)}")
    