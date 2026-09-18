package com.inspection.dto;

import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private long totalTeachers;
    private long completedVisits;
    private int recommendationsCompletionRate;
    private String overallAvg;
    private Map<String, Long> levelCounts;
    private List<Map<String, Object>> evolutionWeeks;
    private List<Map<String, Object>> recentActivities;

    public DashboardDTO() {}

    public DashboardDTO(long totalTeachers, long completedVisits, int recommendationsCompletionRate, String overallAvg, Map<String, Long> levelCounts, List<Map<String, Object>> evolutionWeeks, List<Map<String, Object>> recentActivities) {
        this.totalTeachers = totalTeachers;
        this.completedVisits = completedVisits;
        this.recommendationsCompletionRate = recommendationsCompletionRate;
        this.overallAvg = overallAvg;
        this.levelCounts = levelCounts;
        this.evolutionWeeks = evolutionWeeks;
        this.recentActivities = recentActivities;
    }

    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public long getCompletedVisits() {
        return completedVisits;
    }

    public void setCompletedVisits(long completedVisits) {
        this.completedVisits = completedVisits;
    }

    public int getRecommendationsCompletionRate() {
        return recommendationsCompletionRate;
    }

    public void setRecommendationsCompletionRate(int recommendationsCompletionRate) {
        this.recommendationsCompletionRate = recommendationsCompletionRate;
    }

    public String getOverallAvg() {
        return overallAvg;
    }

    public void setOverallAvg(String overallAvg) {
        this.overallAvg = overallAvg;
    }

    public Map<String, Long> getLevelCounts() {
        return levelCounts;
    }

    public void setLevelCounts(Map<String, Long> levelCounts) {
        this.levelCounts = levelCounts;
    }

    public List<Map<String, Object>> getEvolutionWeeks() {
        return evolutionWeeks;
    }

    public void setEvolutionWeeks(List<Map<String, Object>> evolutionWeeks) {
        this.evolutionWeeks = evolutionWeeks;
    }

    public List<Map<String, Object>> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<Map<String, Object>> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
