#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
converter_tbca.py

Converte o JSON bruto importado da TBCA para um formato limpo e padronizado para o NutriVida.

Entrada:
  tbca.json

Saída:
  tbca_pronto.json

Uso:
  py converter_tbca.py
  ou
  python converter_tbca.py --in tbca.json --out tbca_pronto.json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


MAPA = {
    "energia": "kcal",
    "energia kcal": "kcal",
    "proteina": "proteina",
    "proteína": "proteina",
    "carboidrato total": "carbo",
    "carboidrato disponivel": "carbo_disponivel",
    "carboidrato disponível": "carbo_disponivel",
    "lipidios": "gordura",
    "lipídios": "gordura",
    "fibra alimentar": "fibra",
    "calcio": "calcio",
    "cálcio": "calcio",
    "ferro": "ferro",
    "sodio": "sodio",
    "sódio": "sodio",
    "colesterol": "colesterol",
    "vitamina c": "vitc",
    "zinco": "zinco",
    "retinol": "retinol",
    "vitamina a rae": "retinol",
    "vitamina a re": "vitamina_a_re",
    "potassio": "potassio",
    "potássio": "potassio",
    "magnesio": "magnesio",
    "magnésio": "magnesio",
    "fosforo": "fosforo",
    "fósforo": "fosforo",
}


def norm(txt: Any) -> str:
    s = str(txt or "").strip().lower()
    s = (
        s.replace("á", "a").replace("à", "a").replace("ã", "a").replace("â", "a")
        .replace("é", "e").replace("ê", "e")
        .replace("í", "i")
        .replace("ó", "o").replace("ô", "o").replace("õ", "o")
        .replace("ú", "u")
        .replace("ç", "c")
    )
    s = re.sub(r"[^a-z0-9]+", " ", s).strip()
    return s


def num(v: Any) -> float:
    if v is None or v == "":
        return 0.0
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).replace(".", "").replace(",", ".")
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    return float(m.group(0)) if m else 0.0


def valor_obj(obj: Dict[str, Any], nome: str) -> float:
    item = obj.get(nome)
    if isinstance(item, dict):
        return num(item.get("valor"))
    return num(item)


def extrair_nutrientes(raw: Dict[str, Any], flat: Optional[Dict[str, Any]] = None) -> Dict[str, float]:
    """
    Retorna sempre as mesmas chaves esperadas pelo NutriVida.
    """
    raw = raw or {}
    flat = flat or {}

    # Primeiro tenta o flat; depois o bruto por nomes.
    out = {
        "kcal": num(flat.get("energia_kcal")),
        "proteina": num(flat.get("proteina_g")),
        "carbo": num(flat.get("carboidrato_g") if flat.get("carboidrato_g") is not None else flat.get("carboidrato_disponivel_g")),
        "carbo_disponivel": num(flat.get("carboidrato_disponivel_g")),
        "gordura": num(flat.get("lipideos_g") if flat.get("lipideos_g") is not None else flat.get("lipidios_g")),
        "fibra": num(flat.get("fibra_alimentar_g")),
        "calcio": num(flat.get("calcio_mg")),
        "ferro": num(flat.get("ferro_mg")),
        "sodio": num(flat.get("sodio_mg")),
        "colesterol": num(flat.get("colesterol_mg")),
        "vitc": num(flat.get("vitamina_c_mg")),
        "zinco": num(flat.get("zinco_mg")),
        "retinol": num(flat.get("retinol_mcg")),
        "potassio": num(flat.get("potassio_mg")),
        "magnesio": num(flat.get("magnesio_mg")),
        "fosforo": num(flat.get("fosforo_mg")),
    }

    for original, item in raw.items():
        chave = MAPA.get(norm(original))
        if not chave:
            continue
        if out.get(chave, 0) == 0:
            if isinstance(item, dict):
                out[chave] = num(item.get("valor"))
            else:
                out[chave] = num(item)

    return out


def converter_alimento(a: Dict[str, Any], idx: int) -> Dict[str, Any]:
    codigo = str(a.get("codigo") or a.get("id") or a.get("numero") or f"tbca_{idx}")
    nome = a.get("nome") or a.get("descricao") or a.get("descricao alimento") or "Alimento sem nome"

    nutrientes100 = extrair_nutrientes(
        a.get("nutrientes_100g", {}),
        a.get("nutrientes_100g_flat", {}),
    )

    medidas = []
    for m_idx, m in enumerate(a.get("medidas", []) or []):
        nutrientes_medida = extrair_nutrientes(
            m.get("nutrientes", {}),
            m.get("nutrientes_flat", {}),
        )
        medidas.append({
            "id": f"{codigo}_m{m_idx}",
            "nome": m.get("nome") or m.get("rotulo") or f"Medida {m_idx+1}",
            "rotulo": m.get("rotulo") or m.get("nome") or f"Medida {m_idx+1}",
            "quantidade": num(m.get("quantidade")),
            "unidade": m.get("unidade") or "",
            "nutrientes": nutrientes_medida,
        })

    return {
        "id": codigo,
        "codigo": codigo,
        "nome": nome,
        "descricao": a.get("descricao") or nome,
        "grupo": a.get("grupo") or "Sem grupo",
        "tipo_alimento": a.get("tipo_alimento") or "",
        "nome_cientifico": a.get("nome_cientifico"),
        "fonte": "TBCA",
        "url": a.get("url"),
        "nutrientes100g": nutrientes100,
        "medidas": medidas,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--in", dest="entrada", default="tbca.json")
    parser.add_argument("--out", dest="saida", default="tbca_pronto.json")
    parser.add_argument("--pretty", action="store_true", default=True)
    args = parser.parse_args()

    entrada = Path(args.entrada)
    saida = Path(args.saida)

    data = json.loads(entrada.read_text(encoding="utf-8"))
    alimentos_raw = data if isinstance(data, list) else data.get("alimentos", [])

    alimentos = [converter_alimento(a, i) for i, a in enumerate(alimentos_raw, start=1)]
    alimentos = [a for a in alimentos if a["nome"] and a["nome"] != "Alimento sem nome"]

    payload = {
        "fonte": "TBCA",
        "formato": "NutriVida TBCA normalizado",
        "total": len(alimentos),
        "alimentos": alimentos,
    }

    saida.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {len(alimentos)} alimentos convertidos para {saida.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
