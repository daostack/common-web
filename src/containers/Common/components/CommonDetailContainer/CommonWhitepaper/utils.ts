const generateCirclesBinaryNumber = (circles: number[]) => {
  const circlesSet = new Set(circles);

  let binary = '';

  for (let i = 0; i < 32; i++) {
    binary = `${binary}${circlesSet.has(i) ? "1" : "0"}`
  }

  return parseInt(binary, 2);
}

export const calculateVoters = (circles: string[] | undefined, weights: any) => {
  const binaryCircles = circles?.map((circle, index) => {
    return { binary: generateCirclesBinaryNumber([index]), id: circle };
  });

  const circlesWithVotingWeight = binaryCircles?.filter(({ binary }) => {
    return weights?.find(({ circles }) => { return circles & binary });
  })

  const voters = circlesWithVotingWeight?.map(c => c.id);

  return voters;
}
