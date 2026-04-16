function normalizeValue(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function scoreToken(haystack, token) {
  if (!token) {
    return 0;
  }

  if (haystack.startsWith(token)) {
    return 180 - token.length;
  }

  const includeIndex = haystack.indexOf(token);
  if (includeIndex !== -1) {
    return 140 - includeIndex;
  }

  let needleIndex = 0;
  let streak = 0;
  let score = 0;

  for (let index = 0; index < haystack.length && needleIndex < token.length; index += 1) {
    if (haystack[index] === token[needleIndex]) {
      streak += 1;
      needleIndex += 1;
      score += 8 + streak * 3;
    } else {
      streak = 0;
      score -= 1;
    }
  }

  if (needleIndex !== token.length) {
    return -1;
  }

  return score;
}

export function matchesAutoQuery(auto, query) {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    return { matched: true, score: 0 };
  }

  const searchableValues = [
    auto.marca,
    auto.modelo,
    auto.descripcion,
    auto.anio,
    auto.estado,
  ]
    .map(normalizeValue)
    .join(' ');

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  let totalScore = 0;

  for (const token of tokens) {
    const tokenScore = scoreToken(searchableValues, token);

    if (tokenScore < 0) {
      return { matched: false, score: 0 };
    }

    totalScore += tokenScore;
  }

  return { matched: true, score: totalScore };
}
