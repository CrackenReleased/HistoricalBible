"""Shared read-only PDF preservation gate, cached for identical proof pairs.

Historical stage tests may resolve to the same retained proofs. Keep their
feature-specific checks, but extract each unchanged page pair only once.
File size/mtime keys invalidate the cache when a proof is replaced.
"""
from functools import lru_cache
from pathlib import Path
import pymupdf


def page_preservation_errors(source, output):
    def identity(value):
        path = Path(value).resolve()
        stat = path.stat()
        return (str(path), stat.st_size, stat.st_mtime_ns)
    return _compare(identity(source), identity(output))


def _links(page, shift=0):
    keys = ("kind", "from", "page", "to", "zoom", "uri", "nameddest", "file", "page_from")
    links = [{key: tuple(round(x, 3) for x in value)
              if key in ("from", "to") and value is not None else value
              for key, value in link.items() if key in keys}
             for link in page.get_links()]
    for link in links:
        if isinstance(link.get("page"), int) and link["page"] >= 1:
            link["page"] += shift
    return links


@lru_cache(maxsize=16)
def _compare(source, output):
    errors = []
    with pymupdf.open(source[0]) as old, pymupdf.open(output[0]) as new:
        shift = len(new) - len(old)
        if shift not in (0, 1):
            return (f"Unexpected page count change: {len(old)} -> {len(new)}",)
        if shift and new[1].get_label() != "Note":
            return ("Inserted page must be the edition note",)
        for index, before in enumerate(old):
            after = new[index + (shift if index >= 1 else 0)]
            if before.rect != after.rect:
                errors.append(f"Page {index + 1}: geometry changed")
            if before.get_text() != after.get_text():
                errors.append(f"Page {index + 1}: text changed")
            expected = _links(before, shift)
            if expected != _links(after)[:len(expected)]:
                errors.append(f"Page {index + 1}: existing navigation changed")
    return tuple(errors)
