import React, { useState, useEffect } from 'react';
// Import the dummy data (you'll load this from the JSON file)
import activitiesData from '../../mockData/activities.json';

// ========================================
// MAIN COMPONENT: ActivityDashboard
// ========================================
const ActivityDashboard = () => {
  // -------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------

  // This holds all our activities (loaded from JSON initially)
  const [activities, setActivities] = useState([]);

  // This controls which filter is active: 'all', 'pending', or 'completed'
  const [activeFilter, setActiveFilter] = useState('all');

  // This controls whether the "Add Activity" form is visible
  const [showForm, setShowForm] = useState(false);

  // These hold the values typed into the form inputs
  const [formData, setFormData] = useState({
    teacherName: '',
    activityName: '',
    startTime: '',
    endTime: '',
  });

  // -------------------------------------
  // LOAD MOCK DATA WHEN COMPONENT MOUNTS
  // -------------------------------------
  useEffect(() => {
    // Load the activities from the imported JSON file
    setActivities(activitiesData);
  }, []); // Empty array means this runs only once when component loads

  // -------------------------------------
  // FILTER LOGIC
  // -------------------------------------
  // This function filters activities based on the selected filter
  const getFilteredActivities = () => {
    if (activeFilter === 'all') {
      return activities; // Show all activities
    } else if (activeFilter === 'pending') {
      return activities.filter((activity) => activity.status === 'pending');
    } else if (activeFilter === 'completed') {
      return activities.filter((activity) => activity.status === 'completed');
    }
    return activities;
  };

  // -------------------------------------
  // WORKLOAD WARNING LOGIC
  // -------------------------------------
  // This function checks if a teacher already has 2 or more pending activities
  const checkTeacherWorkload = (teacherName) => {
    const pendingCount = activities.filter(
      (activity) =>
        activity.teacherName === teacherName && activity.status === 'pending'
    ).length;

    return pendingCount >= 2; // Returns true if teacher has 2+ pending activities
  };

  // -------------------------------------
  // HANDLE FORM INPUT CHANGES
  // -------------------------------------
  // This updates the form data when user types in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // -------------------------------------
  // ADD NEW ACTIVITY (CREATE)
  // -------------------------------------
  const handleAddActivity = () => {
    // Validate that all fields are filled
    if (
      !formData.teacherName ||
      !formData.activityName ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert('Please fill in all fields!');
      return;
    }

    // Check for workload warning BEFORE adding the activity
    if (checkTeacherWorkload(formData.teacherName)) {
      alert('⚠️ Overload Warning: This teacher has too many tasks!');
      // You can still proceed, but user is warned
    }

    // Create new activity object
    const newActivity = {
      id: Date.now(), // Simple unique ID using timestamp
      teacherName: formData.teacherName,
      activityName: formData.activityName,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'pending', // New activities start as pending
    };

    // Add the new activity to the list
    setActivities([...activities, newActivity]);

    // Clear the form and hide it
    setFormData({
      teacherName: '',
      activityName: '',
      startTime: '',
      endTime: '',
    });
    setShowForm(false);

    // Show success message
    alert('✅ Activity added successfully!');
  };

  // -------------------------------------
  // TOGGLE STATUS (UPDATE)
  // -------------------------------------
  // This switches activity status between 'pending' and 'completed'
  const handleToggleStatus = (id) => {
    setActivities(
      activities.map((activity) => {
        if (activity.id === id) {
          return {
            ...activity,
            status: activity.status === 'pending' ? 'completed' : 'pending',
          };
        }
        return activity;
      })
    );
  };

  // -------------------------------------
  // DELETE ACTIVITY
  // -------------------------------------
  const handleDeleteActivity = (id) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter((activity) => activity.id !== id));
      alert('🗑️ Activity deleted successfully!');
    }
  };

  // -------------------------------------
  // GET ACTIVITY BADGE COLOR
  // -------------------------------------
  // This function returns different colors for different activity types
  const getActivityBadgeColor = (activityName, status) => {
    // Color mapping based on activity name
    const activityColors = {
      'Morning Circle': { bg: '#dbeafe', text: '#1e40af' }, // Light blue
      'Outdoor Play': { bg: '#d1fae5', text: '#065f46' }, // Light green
      Storytime: { bg: '#e5e7eb', text: '#374151' }, // Gray
      'Art & Crafts': { bg: '#fed7aa', text: '#9a3412' }, // Light orange
      Unassigned: { bg: '#e5e7eb', text: '#6b7280' }, // Gray
    };

    // Return color based on activity name, or default colors based on status
    if (activityColors[activityName]) {
      return activityColors[activityName];
    }

    // Default fallback colors
    return status === 'completed'
      ? { bg: '#d1fae5', text: '#065f46' }
      : { bg: '#fed7aa', text: '#9a3412' };
  };

  // -------------------------------------
  // RENDER THE COMPONENT
  // -------------------------------------
  return (
    <div style={styles.container}>
      {/* ========== HEADER SECTION ========== */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Schedules ⭐</h1>
          <p style={styles.subtitle}>
            Manage daily activities and teacher assignments.
          </p>
        </div>

        {/* New Activity Button */}
        <button
          style={styles.newActivityButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close Form' : '+ New Activity'}
        </button>
      </div>

      {/* ========== ADD ACTIVITY FORM ========== */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add New Activity</h3>

          <div style={styles.formGrid}>
            {/* Teacher Name Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Teacher Name</label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                placeholder="e.g., Sarah Jenkins"
                style={styles.input}
              />
            </div>

            {/* Activity Name Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Activity Name</label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleInputChange}
                placeholder="e.g., Morning Circle"
                style={styles.input}
              />
            </div>

            {/* Start Time Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            {/* End Time Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Apply Button */}
          <button style={styles.applyButton} onClick={handleAddActivity}>
            Apply
          </button>
        </div>
      )}

      {/* ========== FILTER BUTTONS ========== */}
      <div style={styles.filterContainer}>
        <button
          style={{
            ...styles.filterButton,
            ...(activeFilter === 'all' ? styles.filterButtonActive : {}),
          }}
          onClick={() => setActiveFilter('all')}
        >
          All ({activities.length})
        </button>

        <button
          style={{
            ...styles.filterButton,
            ...(activeFilter === 'pending' ? styles.filterButtonActive : {}),
          }}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({activities.filter((a) => a.status === 'pending').length})
        </button>

        <button
          style={{
            ...styles.filterButton,
            ...(activeFilter === 'completed' ? styles.filterButtonActive : {}),
          }}
          onClick={() => setActiveFilter('completed')}
        >
          Completed ({activities.filter((a) => a.status === 'completed').length}
          )
        </button>
      </div>

      {/* ========== ACTIVITIES TABLE ========== */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>TEACHER'S NAME</th>
              <th style={styles.tableHeader}>ACTIVITY</th>
              <th style={styles.tableHeader}>DAILY TIME</th>
              <th style={styles.tableHeader}>ASSIGN</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredActivities().length === 0 ? (
              // Show message if no activities match the filter
              <tr>
                <td colSpan="4" style={styles.emptyMessage}>
                  No activities found. Add a new activity to get started!
                </td>
              </tr>
            ) : (
              // Display each activity as a table row
              getFilteredActivities().map((activity) => {
                const badgeColor = getActivityBadgeColor(
                  activity.activityName,
                  activity.status
                );
                return (
                  <tr key={activity.id} style={styles.tableRow}>
                    {/* Teacher Name with Avatar Circle */}
                    <td style={styles.tableCell}>
                      <div style={styles.teacherCell}>
                        <div style={styles.avatar}>
                          {activity.teacherName.charAt(0)}
                        </div>
                        <span>{activity.teacherName}</span>
                      </div>
                    </td>

                    {/* Activity Name with Color Badge */}
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.activityBadge,
                          backgroundColor: badgeColor.bg,
                          color: badgeColor.text,
                        }}
                      >
                        {activity.activityName}
                      </span>
                    </td>

                    {/* Time Range */}
                    <td style={styles.tableCell}>
                      {activity.startTime} - {activity.endTime}
                    </td>

                    {/* Actions Column with Status Toggle and Delete */}
                    <td style={styles.tableCell}>
                      <div style={styles.actionsCell}>
                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(activity.id)}
                          style={{
                            ...styles.statusButton,
                            backgroundColor:
                              activity.status === 'completed'
                                ? '#10b981'
                                : '#fbbf24',
                            color: '#fff',
                          }}
                        >
                          {activity.status === 'completed'
                            ? '✓ Completed'
                            : '⏳ Pending'}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          style={styles.deleteButton}
                          title="Delete Activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========================================
// INLINE STYLES - UPDATED COLOR PALETTE
// ========================================
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9fafb', // Very light gray background
    minHeight: '100vh',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827', // Dark gray/black
    margin: '0 0 5px 0',
  },

  subtitle: {
    fontSize: '14px',
    color: '#6b7280', // Medium gray
    margin: 0,
  },

  newActivityButton: {
    backgroundColor: '#06b6d4', // Cyan/Turquoise
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  formCard: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },

  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },

  applyButton: {
    backgroundColor: '#111827',
    color: '#fff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },

  filterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },

  filterButton: {
    backgroundColor: '#fff',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  filterButtonActive: {
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderColor: '#06b6d4',
    boxShadow: '0 1px 3px rgba(6, 182, 212, 0.3)',
  },

  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  tableHeaderRow: {
    backgroundColor: '#f9fafb',
  },

  tableHeader: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '700',
    color: '#9ca3af', // Light gray
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e5e7eb',
  },

  tableRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },

  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#111827',
  },

  teacherCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#d1d5db', // Light gray
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
  },

  activityBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
  },

  actionsCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  statusButton: {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px 10px',
    transition: 'transform 0.2s ease',
    color: '#9ca3af',
  },

  emptyMessage: {
    padding: '40px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
};

// Export the component so it can be used in other files
export default ActivityDashboard;
