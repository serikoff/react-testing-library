import React from "react";
import axios from "axios";
import {render, screen, act, fireEvent} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import SomeComponent from "./someComponent";
import expect from "expect";

jest.mock("axios");
const hits = [
  { objectID: "1", title: "Angular" },
  { objectID: "2", title: "React" },
];

describe("SomeComponent", () => {
  it("Render SomeComponent", () => {
    render(<SomeComponent />);
    expect(screen.getByText(/This is Some component/i)).toBeInTheDocument();
  });
})

describe("App", () => {
  it("Render SomeComponent", () => {
    render(<SomeComponent />);
    expect(screen.getByText(/This is Some component/i)).toBeInTheDocument();
  });

  it("First render App", () => {
    render(<App />);
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.queryByText(/visibility text/i)).toBeNull();
  });

  it("fetches news from an API", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: { hits } }));
    render(<App />);
    userEvent.click(screen.queryByText("Fetch News"));
    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    // Additional
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      "https://hn.algolia.com/api/v1/search?query=React"
    );
  });

  it("fetches news from an API and reject", async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
    render(<App />);
    userEvent.click(screen.queryByText("Fetch News"));
    const message = await screen.findByText(/Something went wrong/);
    expect(message).toBeInTheDocument();
  });

  it("fetches news from an API (alternative)", async () => {
    const promise = Promise.resolve({ data: { hits } });
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    userEvent.click(screen.queryByText("Fetch News"));
    await act(() => promise);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it("Last render App", async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
    render(<App />);
    userEvent.click(screen.queryByText("Fetch News"));

    // для асинхронных запросов
    const initTextElement = await screen.findByText(/some text/i);
    expect(initTextElement).not.toBeInTheDocument();
    const initTextElement2 = screen.queryByText(/some text/i);
    expect(initTextElement2).toBeNull()
  });

  it("Click visibility button", async () => {
    render(<App />);
    expect(screen.queryByText(/visibility text/i)).toBeNull();
    userEvent.click(screen.queryByText("show text button"));
    expect(await screen.findByText(/visibility text/i)).toBeInTheDocument();
  });

  it("Click visibility button", async () => {
    render(<App />);
    const inputValue = 'fdsfds'
    expect(screen.queryByRole('textbox')).toBeRequired();
    expect(screen.queryByRole('textbox')).toHaveAttribute('id');
    expect(screen.queryByRole('textbox')).toHaveValue('')
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: inputValue}
    });
    expect(screen.queryByRole('textbox')).toHaveValue(inputValue)
  });
});

describe("events", () => {
  it('checkbox click', () => {
    const handleChange = jest.fn();
    const { container} = render(<input type={'checkbox'} onChange={handleChange} /> )
    const checkboxElement = container.firstChild;
    expect(checkboxElement).not.toBeChecked();
    fireEvent.click(checkboxElement);
    // проверяет что был вызван обработчик handleChange
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkboxElement).toBeChecked();
  })
})
