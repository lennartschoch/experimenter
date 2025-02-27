/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { UPDATE_EXPERIMENT_MUTATION } from "../../gql/experiments";
import {
  ARCHIVING_EXPERIMENT,
  UNARCHIVING_EXPERIMENT,
} from "../../hooks/useArchive";
import { mockExperiment, mockExperimentMutation } from "../../lib/mocks";
import { Subject } from "./mocks";

describe("SidebarActions", () => {
  it("renders sidebar actions content", () => {
    render(<Subject />);
    expect(screen.getByTestId("SidebarActions")).toBeInTheDocument();
  });

  it("renders a disabled archive button for unarchived experiment", () => {
    render(<Subject experiment={{ isArchived: false, canArchive: false }} />);
    expect(screen.getByTestId("action-archive")).toHaveClass("text-muted");
    expect(screen.getByTestId("action-archive")).toHaveTextContent(
      "Archive Experiment",
    );
  });

  it("renders an enabled archive button for unarchived experiment", () => {
    render(<Subject experiment={{ isArchived: false, canArchive: true }} />);
    expect(screen.getByTestId("action-archive")).toHaveAttribute(
      "href",
      "/nimbus/my-special-slug/#",
    );
    expect(screen.getByTestId("action-archive")).toHaveTextContent(
      "Archive Experiment",
    );
  });
  it("renders a disabled unarchive button for archived experiment", () => {
    render(<Subject experiment={{ isArchived: true, canArchive: false }} />);
    expect(screen.getByTestId("action-archive")).toHaveClass("text-muted");
    expect(screen.getByTestId("action-archive")).toHaveTextContent(
      "Unarchive Experiment",
    );
  });

  it("renders an enabled archive button for unarchived experiment", () => {
    render(<Subject experiment={{ isArchived: true, canArchive: true }} />);
    expect(screen.getByTestId("action-archive")).toHaveAttribute(
      "href",
      "/nimbus/my-special-slug/#",
    );
    expect(screen.getByTestId("action-archive")).toHaveTextContent(
      "Unarchive Experiment",
    );
  });
  it("calls update archive mutation when archive button is clicked", async () => {
    const experiment = mockExperiment({ isArchived: false, canArchive: true });
    const refetch = jest.fn();
    const mutationMock = mockExperimentMutation(
      UPDATE_EXPERIMENT_MUTATION,
      {
        id: experiment.id,
        isArchived: true,
        changelogMessage: ARCHIVING_EXPERIMENT,
      },
      "updateExperiment",
      {
        message: "success",
      },
    );

    render(<Subject {...{ experiment, refetch }} mocks={[mutationMock]} />);

    const archiveButton = await screen.findByTestId("action-archive");

    fireEvent.click(archiveButton);
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });
  it("calls update archive mutation when unarchive button is clicked", async () => {
    const experiment = mockExperiment({ isArchived: true, canArchive: true });
    const refetch = jest.fn();
    const mutationMock = mockExperimentMutation(
      UPDATE_EXPERIMENT_MUTATION,
      {
        id: experiment.id,
        isArchived: false,
        changelogMessage: UNARCHIVING_EXPERIMENT,
      },
      "updateExperiment",
      {
        message: "success",
      },
    );

    render(<Subject {...{ experiment, refetch }} mocks={[mutationMock]} />);

    const archiveButton = await screen.findByTestId("action-archive");

    fireEvent.click(archiveButton);
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });
});
