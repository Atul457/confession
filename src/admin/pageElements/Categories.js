import React from 'react';

export default function Category(props) {


  // MAKES CLICKED CATEGORY BUTTON ACTIVE AND 
  // MAKES THE GETCONFESSIONS API BEING HIT ON FEED COMPONENT
  function getCategory(element) {

    let activeCatName;
    let categoryItems = document.querySelectorAll('.category');

    if (element.classList.contains('category')) {

      element.classList.toggle('activeCategory');
      if (element.classList.contains('activeCategory')) {
        categoryItems.forEach((currentCategory) => {
          currentCategory.classList.remove("activeCategory");
        });
        element.classList.add("activeCategory");
        activeCatName = element.getAttribute("id");
        props.updateActiveCategory(activeCatName);  //UPDATES THE ACTIVECATEGORY STATE VAR IN FEED COMP
      } else {
        activeCatName = "all";
        props.updateActiveCategory(activeCatName);  //UPDATES THE ACTIVECATEGORY STATE VAR IN FEED COMP
      }
    }
  }


  // MAKES DASHBOARD COMPONENT, CALL "OPENADDCATEGORIESMODALFUNC" FUNCTION
  const openAddCategoriesModalFunc = () => {
    props.openAddCategoriesModalFunc();
  }

  const openEditCategoriesModalFunc = (categoryObject) => {
    props.openEditCategoriesModalFunc(categoryObject);
  }

  return (
    <div className="container-fluid px-2">
      <div className="row">
        <div className="container px-2 px-0">
          <div className="row px-lg-2 px-0">
            <div className="col-12 categoryHead">
              Choose categories to filter confession
            </div>
            <div className="categoriesContainer w-100 px-3">
              {props.categories.isLoading ? (
                <div>
                  <div className="spinner-border pColor" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) :
                (props.categories.isError === true ?
                  (props.categories.message === ""
                    ?
                    (<div className="alert alert-danger" role="alert">
                      Something went wrong.
                    </div>)
                    :
                    (<div className="alert alert-danger" role="alert">
                      {props.categories.message}
                    </div>)
                  ) :
                  (
                    <>
                      {
                        (props.categories.data).map((element, index) => {
                          return (
                            // MAKES TEXT CENTER OF CATEGORY BUTTONS IF EDIT BUTTONS ARE NOT VISIBLE 
                            <div key={`categoriesContainerInside${index}`}
                              id={element.id}
                              className={`category ${props.editVisible === true ? "adminCategorySidebar" : ''} ${(props.activeCatIndex).toString() === (element.id).toString() ? 'activeCategory' : ''}`}
                              type="button"
                              onClick={(e) => { getCategory(e.target) }}>
                              {/* HIDES EDIT BUTTON AND STATUS FROM CATEGORIES */}
                              {props.editVisible === true ?
                                <>
                                  <i className="fa fa-pencil categoryEditIcon"
                                    onClick={() => {
                                      openEditCategoriesModalFunc({
                                        id: element.id,
                                        status: element.status,
                                        category_name: element.category_name
                                      })
                                    }}
                                    aria-hidden="true"
                                    type="button"></i>

                                  <span className={`categoryStatus ${parseInt(element.status) === 1 ? "categoryStatusGreen" : "categoryStatusRed"}`}></span>
                                </>
                                : ''}
                              <span className="innerAdminCatName">{(element.category_name).charAt(0) + ((element.category_name).slice(1).toLowerCase())}</span>

                            </div>
                          );
                        }
                        )
                      }

                      {props.editVisible === true &&
                        <div className="category manageCategoryButton" type="button" onClick={openAddCategoriesModalFunc}>
                          <i className="fa fa-plus pr-1" aria-hidden="true"></i>
                          <span className="manageCategoryMainText">Add Categories</span>
                        </div>}
                    </>
                  )
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
