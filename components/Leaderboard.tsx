
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface Score {
  user: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresCollection = collection(db, 'leaderboard');
      const q = query(scoresCollection, orderBy('score', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const scoresData = querySnapshot.docs.map(doc => doc.data() as Score);
      setScores(scoresData);
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {scores.map((score, index) => (
          <li key={index}>{score.user}: {score.score}</li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
