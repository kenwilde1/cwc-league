
import { isMajorTeam } from './is_major_team';

function getPredictions(id: string) {
    return [];
}

function isPredictedOutcomeCorrect(prediction: any, result: any): boolean {
    const getOutcome = (homeGoals: number, awayGoals: number): string => {
      if (homeGoals > awayGoals) return 'home';
      if (homeGoals < awayGoals) return 'away';
      return 'draw';
    };
  
    const predictedOutcome = getOutcome(prediction.home_goals, prediction.away_goals);
    const actualOutcome = getOutcome(result.home_goals, result.away_goals);
  
    return predictedOutcome === actualOutcome;
  }
  
  export function calculatePoints(id: string, results: any[]): number {
    let points = 0;
    const predictions = getPredictions(id); // assumes this returns predictions in same order as results
  
    results.forEach((result, index) => {
      const prediction = predictions[index] as any;
      if (!prediction) return;
  
      const outcomeCorrect = isPredictedOutcomeCorrect(prediction, result);
  
      const homeTeamMajor = isMajorTeam(result.home_team);
      const awayTeamMajor = isMajorTeam(result.away_team);
      const homeTeamMinor = !homeTeamMajor;
      const awayTeamMinor = !awayTeamMajor;
  
      const majorVsMinor =
        (homeTeamMajor && awayTeamMinor) || (awayTeamMajor && homeTeamMinor);
  
      const predictedHomeWin = prediction.home_goals > prediction.away_goals;
      const predictedAwayWin = prediction.home_goals < prediction.away_goals;
  
      // Outcome points
      if (outcomeCorrect) {
        if (
          majorVsMinor &&
          ((predictedHomeWin && homeTeamMinor) ||
            (predictedAwayWin && awayTeamMinor))
        ) {
          points += 6; // bonus for correctly predicting a minor team win against a major
        } else {
          points += 3;
        }
      }
  
      // Home goals
      if (prediction.home_goals === result.home_goals) {
        if (majorVsMinor && homeTeamMinor) {
          points += 2;
        } else {
          points += 1;
        }
      }
  
      // Away goals
      if (prediction.away_goals === result.away_goals) {
        if (majorVsMinor && awayTeamMinor) {
          points += 2;
        } else {
          points += 1;
        }
      }
    });
  
    return points;
  }