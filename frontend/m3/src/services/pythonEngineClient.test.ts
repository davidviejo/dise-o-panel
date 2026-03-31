import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getBatchJob,
  getBatchJobItems,
  updateBatchJob,
} from './pythonEngineClient';
import { endpoints } from './endpoints';

describe('pythonEngineClient', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('normalizes backend job payloads to the frontend shape', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        jobId: 'job-123',
        status: 'completed',
        total: 10,
        processed: 7,
        success: 6,
        errors: 1,
        createdAt: '2026-03-23T10:00:00Z',
        lastError: 'boom',
      }),
    });

    await expect(getBatchJob('job-123')).resolves.toEqual({
      id: 'job-123',
      status: 'done',
      progress: {
        total: 10,
        processed: 7,
        succeeded: 6,
        failed: 1,
      },
      created_at: '2026-03-23T10:00:00Z',
      completed_at: undefined,
      error: 'boom',
    });
  });

  it('uses backend action endpoints for batch job controls', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'paused' }),
    });

    await updateBatchJob('job-42', 'pause');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(endpoints.engine.jobAction('job-42', 'pause')),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('requests pageSize and normalizes batch items from the backend', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            item_id: 'item-1',
            status: 'running',
            url: 'https://example.com',
            updated_at: '2026-03-23T11:00:00Z',
          },
        ],
        total: 1,
      }),
    });

    const response = await getBatchJobItems('job-1', 'running', 2, 25);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(endpoints.engine.jobItems('job-1', new URLSearchParams({ page: '2', pageSize: '25', status: 'running' }))),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(response).toEqual({
      items: [
        {
          itemId: 'item-1',
          status: 'processing',
          url: 'https://example.com',
          error: undefined,
          updated_at: '2026-03-23T11:00:00Z',
        },
      ],
      total: 1,
    });
  });

  it('supports comma-separated statuses when fetching batch items', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ item_id: 'item-queued', status: 'queued', url: 'https://example.com/queued' }],
          total: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ item_id: 'item-running', status: 'running', url: 'https://example.com/running' }],
          total: 2,
        }),
      });

    const response = await getBatchJobItems('job-2', 'queued,running', 1, 50);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        endpoints.engine.jobItems(
          'job-2',
          new URLSearchParams({ page: '1', pageSize: '50', status: 'queued' }),
        ),
      ),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        endpoints.engine.jobItems(
          'job-2',
          new URLSearchParams({ page: '1', pageSize: '50', status: 'running' }),
        ),
      ),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(response).toEqual({
      items: [
        {
          itemId: 'item-queued',
          status: 'pending',
          url: 'https://example.com/queued',
          error: undefined,
          updated_at: undefined,
        },
        {
          itemId: 'item-running',
          status: 'processing',
          url: 'https://example.com/running',
          error: undefined,
          updated_at: undefined,
        },
      ],
      total: 3,
    });
  });
});
