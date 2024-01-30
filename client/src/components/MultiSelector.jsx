import { useState, useEffect, useRef } from "react";
import styles from "../stylesheets/multiselector.module.css";

function MultiSelector(props) {
  const name = props.name;
  const placeholder = props.placeholder;

  const [options, setOptions] = useState(props.options);
  const [optionsFound, setOptionsFound] = useState(props.options);
  const [visibleList, setVisibleList] = useState(false);

  const selectRef = useRef();
  const inputRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [visibleList]);

  function handleItemsClick() {
    setVisibleList(true);
    inputRef.current.focus();
  }

  function handleInputBlur() {
    setTimeout(() => {
      setVisibleList(false);
    }, 300);
  }

  function handleSearch(event) {
    setOptionsFound(
      options.filter(
        (option) =>
          option.text
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase()
            .includes(
              event.target.value
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
                .toLowerCase()
            ) && !option.selected
      )
    );
  }

  function handleOptionClick(event) {
    let updatedOptions = [...options];
    let index = event.target.getAttribute("option-index");

    updatedOptions[index].selected = true;

    setOptions(updatedOptions);
    setOptionsFound(updatedOptions);

    inputRef.current.value = "";
    setVisibleList(false);
  }

  function handleRemoveSelectionClick(event) {
    event.preventDefault();
    event.stopPropagation();

    let updatedOptions = [...options];
    let index = event.target.getAttribute("option-index");

    updatedOptions[index].selected = false;

    setOptions(updatedOptions);
  }

  return (
    <>
      <div onClick={handleItemsClick} className={styles.items_subcontainer}>
        {options
          .filter((option) => option.selected)
          .map((option, index) => (
            <div className={styles.item} key={index}>
              <p className={styles.item_text}>{option.text}</p>
              <button
                className={styles.item_button}
                option-index={option.index}
                onClick={handleRemoveSelectionClick}
              >
                X
              </button>
            </div>
          ))}
      </div>
      <div
        className={visibleList ? styles.search_subcontainer : styles.hide}
        ref={searchRef}
      >
        <nav className={styles.scroller}>
          <input
            className={styles.input}
            onBlur={handleInputBlur}
            onKeyUp={handleSearch}
            placeholder={placeholder}
            type="text"
            ref={inputRef}
          />

          <ul className={styles.select}>
            {optionsFound.map((option, index) => (
              <li
                className={styles.option}
                hidden={option.selected}
                option-index={option.index}
                key={index}
                onClick={handleOptionClick}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </nav>
        <select
          hidden
          multiple
          readOnly
          name={name}
          value={options
            .filter((option) => option.selected)
            .map((option) => option.value)}
          ref={selectRef}
        >
          {optionsFound.map((option, index) => (
            <option
              option-index={option.index}
              value={option.value}
              key={index}
            ></option>
          ))}
        </select>
      </div>
    </>
  );
}

export default MultiSelector;
