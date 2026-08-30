function ActivityHistory({ activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-green-200 text-left">
      <p className="text-sm font-medium text-green-700 mb-3">
        🌱 Your gentle moments
      </p>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
            <span>🌸</span>
            <span>{activity.name}</span>  {/* ✅ FIXED - use .name */}
            <span className="text-xs text-green-400 ml-auto">
              {new Date(activity.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityHistory;