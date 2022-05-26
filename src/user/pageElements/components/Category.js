import React, { useEffect, useState } from 'react';

export default function Category(props) {


    const [categories, setCategories] = useState([]);
    useEffect(() => {
        setCategories(props.categories);    //Gets the categories from app.js
    }, [props.categories])


    // Makes Clicked Category Button Active and Makes the getConfessions api being hit on Feed Component
    function getCategory(element) {

        let activeCatName;
        let categoryItems = document.querySelectorAll('.category');

        element.classList.toggle('activeCategory');
        if (element.classList.contains('activeCategory')) {
            categoryItems.forEach((currentCategory) => {
                currentCategory.classList.remove("activeCategory");
            });
            element.classList.add("activeCategory");
            activeCatName = element.getAttribute("id");
            props.updateActiveCategory(activeCatName);  //Updates the activeCategory state var in feed Comp
        } else {
            activeCatName = "all";
            props.updateActiveCategory(activeCatName);  //Updates the activeCategory state var in feed Comp
        }
    }


    return (
        <div className="container-fluid px-2">
            <div className="row">
                <div className="container px-2 px-0">
                    <div className="row">
                        <div className={`col-12 categoryHead ${props.hideHead && "d-none"}`}>
                            Choose a Category to filter posts
                        </div>
                        <div className="categoriesContainer w-100">
                            {categories && categories.map((element, index) => {
                                return (
                                    <div key={`categoriesContainerInside${index}`}
                                        id={element.id}
                                        className={`${(props.activeCatIndex).toString() === (element.id).toString() ? 'category activeCategory' : 'category InActive'}`}
                                        type="button"
                                        onClick={(e) => { getCategory(e.target) }}
                                    >{(element.category_name).charAt(0) + ((element.category_name).slice(1).toLowerCase())}</div>
                                );
                            })
                            }
                        </div>
                        {/* <div className="col-12 pt-0 errorCont text-danger" id="categoryRequiredErr" style={{padding : "20px"}}>
                        </div> */}
                        <div className={`col-12 pt-0 filterVerbiage  ${props.hideHead && " d-none"}`}>
                            * Filter out posts by clicking on the categories above. Unselect the category to remove the filter.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
