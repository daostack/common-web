export const formatCamelSnakeCase = (value: string) => {
  return (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()).replaceAll("_", " ");
}

const generateCirclesBinaryNumber = (circles: number[]) => {
  const circlesSet = new Set(circles);

  let binary = '';

  for (let i = 0; i < 32; i++) {
    if (circlesSet.has(i)) {
      binary = binary + '1';
    }
    else {
      binary = binary + 0;
    }
  }

  return parseInt(binary, 2);
}

export const calculateVoters = (circles: string[], weights: any) => {
  const binaryCircles = circles.map((circle, index) => {
    return { binary: generateCirclesBinaryNumber([index]), id: circle };
  });

  const circlesWithVotingWeight = binaryCircles.filter(({ binary, id }) => {
    return weights?.find(({ circles }) => { return circles & binary });
  })

  const voters = circlesWithVotingWeight.map(c => c.id);

  return voters;
}
