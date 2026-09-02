import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { activityService } from '../../services/activityService';
import type {
  MasterActivity,
  MasterActivityCreateRequest,
  ActivityAssignmentDTO,
  AssignActivityRequest,
  StudentProgressDTO,
  SaveProgressPayload,
} from '../../types/activity.types';

// 🚀 FIXED: Line 14 error removed
const getErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string } }; message?: string };

  // Backend එකෙන් පැහැදිලි මැසේජ් එකක් එවලා තියෙනවා නම් ඒක පෙන්නනවා
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // එහෙම නැත්නම් මේ ලස්සන, User-friendly මැසේජ් එක පෙන්නනවා
  return 'Failed to load activities. Please check your connection or log in again.';
};

export const fetchMasterActivities = createAsyncThunk(
  'activity/fetchMasterActivities',
  async (page: number = 0, { rejectWithValue }) => {
    try {
      const response = await activityService.getAllMasterActivities(page);
      return response.content;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteMasterActivity = createAsyncThunk(
  'activity/deleteMasterActivity',
  async (id: string, { rejectWithValue }) => {
    try {
      await activityService.deleteMasterActivity(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addMasterActivity = createAsyncThunk(
  'activity/addMasterActivity',
  async (data: MasterActivityCreateRequest, { rejectWithValue }) => {
    try {
      return await activityService.createMasterActivity(data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMasterActivity = createAsyncThunk(
  'activity/updateMasterActivity',
  async (
    { id, data }: { id: string; data: Partial<MasterActivityCreateRequest> },
    { rejectWithValue },
  ) => {
    try {
      return await activityService.updateMasterActivity(id, data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAssignments = createAsyncThunk(
  'activity/fetchAssignments',
  async ({ date, teacherId }: { date?: string; teacherId?: string }, { rejectWithValue }) => {
    try {
      const response = await activityService.getAssignments(date, teacherId);
      return response as unknown as ActivityAssignmentDTO[];
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const assignActivity = createAsyncThunk(
  'activity/assignActivity',
  async (data: AssignActivityRequest, { rejectWithValue }) => {
    try {
      const response = await activityService.assignActivity(data);
      return response as unknown as ActivityAssignmentDTO;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAssignment = createAsyncThunk(
  'activity/updateAssignment',
  async ({ id, data }: { id: string; data: AssignActivityRequest }, { rejectWithValue }) => {
    try {
      const response = await activityService.updateAssignment(id, data);
      return response as unknown as ActivityAssignmentDTO;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const publishAssignment = createAsyncThunk(
  'activity/publishAssignment',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await activityService.publishAssignment(id);
      return response as unknown as ActivityAssignmentDTO;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAssignment = createAsyncThunk(
  'activity/deleteAssignment',
  async (id: string, { rejectWithValue }) => {
    try {
      await activityService.deleteAssignment(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logStudentProgress = createAsyncThunk(
  'activity/logStudentProgress',
  async (payload: SaveProgressPayload, { rejectWithValue, getState }) => {
    // 🚀 FIXED: Line 139 error removed (TypeScript infers 'log' from the payload type)
    const backendFormattedPayload = {
      assignmentId: payload.assignmentId,
      logs: payload.logs.map((log) => ({
        childId: log.studentId,
        childName: log.studentName,
        attendanceStatus: log.attendanceStatus,
        progressLevel: log.progress,
        note: log.note,
      })),
    };

    try {
      // 🚀 FIXED: Line 150 error removed
      await activityService.logStudentProgress(
        backendFormattedPayload as unknown as StudentProgressDTO,
      );
    } catch (error: unknown) {
      return rejectWithValue(
        `STEP 1 (Saving Logs) Failed! Spring Boot says: ${getErrorMessage(error)}`,
      );
    }

    const state = getState() as { activity: ActivityState };
    const assignment = state.activity.assignments.find((a) => {
      const act = a as ActivityAssignmentDTO & { id?: string };
      return act.id === payload.assignmentId || act.assignmentId === payload.assignmentId;
    });

    if (assignment) {
      const updatePayload = { ...assignment, status: 'COMPLETED' };
      try {
        await activityService.updateAssignment(
          payload.assignmentId,
          updatePayload as unknown as AssignActivityRequest,
        );
      } catch (error: unknown) {
        return rejectWithValue(
          `STEP 2 (Updating Status) Failed! Spring Boot says: ${getErrorMessage(error)}`,
        );
      }
    }

    return payload;
  },
);

interface ActivityState {
  masterActivities: MasterActivity[];
  assignments: ActivityAssignmentDTO[];
  isLoading: boolean;
  error: string | null;
  selectedDate: string;
  studentsLogData: Record<string, StudentProgressDTO[]>;
}

const initialState: ActivityState = {
  masterActivities: [],
  assignments: [],
  isLoading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  studentsLogData: {},
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivityError(state) {
      state.error = null;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMasterActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterActivities = action.payload;
      })
      .addCase(fetchMasterActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(addMasterActivity.fulfilled, (state, action) => {
        state.masterActivities.unshift(action.payload);
      })
      .addCase(deleteMasterActivity.fulfilled, (state, action) => {
        state.masterActivities = state.masterActivities.filter((act) => act.id !== action.payload);
      })
      .addCase(updateMasterActivity.fulfilled, (state, action) => {
        const index = state.masterActivities.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.masterActivities[index] = action.payload;
      })

      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(assignActivity.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      })
      .addCase(publishAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => {
          const act = a as ActivityAssignmentDTO & { id?: string };
          return (
            act.id === action.payload.assignmentId ||
            act.assignmentId === action.payload.assignmentId
          );
        });
        if (index !== -1) state.assignments[index] = action.payload;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter((a) => {
          const act = a as ActivityAssignmentDTO & { id?: string };
          return act.id !== action.payload && act.assignmentId !== action.payload;
        });
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => {
          const act = a as ActivityAssignmentDTO & { id?: string };
          return (
            act.id === action.payload.assignmentId ||
            act.assignmentId === action.payload.assignmentId
          );
        });
        if (index !== -1) state.assignments[index] = action.payload;
      })

      .addCase(logStudentProgress.fulfilled, (state, action) => {
        state.studentsLogData[action.payload.assignmentId] = action.payload.logs;

        const assignment = state.assignments.find((a) => {
          const act = a as ActivityAssignmentDTO & { id?: string };
          return (
            act.id === action.payload.assignmentId ||
            act.assignmentId === action.payload.assignmentId
          );
        });

        if (assignment) {
          Object.assign(assignment, { status: 'COMPLETED' });
        }
      });
  },
});

export const { clearActivityError, setSelectedDate } = activitySlice.actions;
export default activitySlice.reducer;
export const selectMasterActivities = (state: { activity: ActivityState }) =>
  state.activity.masterActivities;
export const selectAssignments = (state: { activity: ActivityState }) => state.activity.assignments;
export const selectActivityLoading = (state: { activity: ActivityState }) =>
  state.activity.isLoading;
export const selectActivityError = (state: { activity: ActivityState }) => state.activity.error;
export const selectSelectedDate = (state: { activity: ActivityState }) =>
  state.activity.selectedDate;
export const selectStudentsLogData = (state: { activity: ActivityState }) =>
  state.activity.studentsLogData;
