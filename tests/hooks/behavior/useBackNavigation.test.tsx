import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildBackState } from "../../../src/helpers/navigation.helper";
import { useBackNavigation } from "../../../src/hooks/behavior/useBackNavigation";
import { useNavigateWithBack } from "../../../src/hooks/behavior/useNavigateWithBack";

afterEach(cleanup);

const CurrentUrl = (): React.ReactElement => {
  const location = useLocation();
  return <span data-testid="url">{location.pathname + location.search}</span>;
};

const ListPage = (): React.ReactElement => {
  const navigateWithBack = useNavigateWithBack();
  return (
    <button
      type="button"
      onClick={e => {
        navigateWithBack("/users/1", e);
      }}
    >
      ouvrir
    </button>
  );
};

const DetailPage = (): React.ReactElement => {
  const goBack = useBackNavigation("/users");
  const [, setSearchParams] = useSearchParams();
  return (
    <>
      <button type="button" onClick={goBack}>
        retour
      </button>
      <button
        type="button"
        onClick={() => {
          setSearchParams({ tab: "roles" });
        }}
      >
        onglet
      </button>
    </>
  );
};

const renderApp = (initialEntries: Parameters<typeof MemoryRouter>[0]["initialEntries"]): void => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/users" element={<ListPage />} />
        <Route path="/users/:id" element={<DetailPage />} />
      </Routes>
      <CurrentUrl />
    </MemoryRouter>,
  );
};

describe("buildBackState", () => {
  it("concatène le chemin et la query string", () => {
    expect(buildBackState({ pathname: "/users", search: "?page=2" })).toEqual({ from: "/users?page=2" });
  });
});

describe("useNavigateWithBack / useBackNavigation", () => {
  it("revient à l'URL d'origine, filtres et page compris", () => {
    renderApp(["/users?page=2&role=admin"]);

    fireEvent.click(screen.getByText("ouvrir"));
    expect(screen.getByTestId("url").textContent).toBe("/users/1");

    fireEvent.click(screen.getByText("retour"));
    expect(screen.getByTestId("url").textContent).toBe("/users?page=2&role=admin");
  });

  it("conserve l'URL d'origine après un setSearchParams sans state sur la même page", () => {
    renderApp(["/users?page=2"]);

    fireEvent.click(screen.getByText("ouvrir"));
    fireEvent.click(screen.getByText("onglet"));
    expect(screen.getByTestId("url").textContent).toBe("/users/1?tab=roles");

    fireEvent.click(screen.getByText("retour"));
    expect(screen.getByTestId("url").textContent).toBe("/users?page=2");
  });

  it("retombe sur le chemin par défaut sans URL d'origine", () => {
    renderApp(["/users/1"]);

    fireEvent.click(screen.getByText("retour"));

    expect(screen.getByTestId("url").textContent).toBe("/users");
  });

  it("ignore un state sans URL d'origine exploitable", () => {
    renderApp([{ pathname: "/users/1", state: { from: 42 } }]);

    fireEvent.click(screen.getByText("retour"));

    expect(screen.getByTestId("url").textContent).toBe("/users");
  });

  it("ouvre un nouvel onglet au Ctrl+clic ou Cmd+clic sans naviguer", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderApp(["/users"]);

    fireEvent.click(screen.getByText("ouvrir"), { ctrlKey: true });
    fireEvent.click(screen.getByText("ouvrir"), { metaKey: true });

    expect(open).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledWith("/users/1", "_blank");
    expect(screen.getByTestId("url").textContent).toBe("/users");
    open.mockRestore();
  });
});
