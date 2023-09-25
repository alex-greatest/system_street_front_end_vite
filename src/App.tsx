import React, {Suspense} from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import {AuthLoader} from "./component/main/AuthLoader";
import {MainTemplate} from "./component/template/MainTemplate";
import {observer} from "mobx-react-lite";
import {PrivateRoute} from "./component/main/PrivateRoute";
import {Loading} from "./component/main/Loading";
import {Parts} from "./pages/Parts.tsx";
import {Operations} from "./pages/Operations.tsx";
import {OperationsResults} from "./pages/OperationResults.tsx";
import {Graphs} from "./pages/Graphs.tsx";

export const App = observer(() => {
    const Login = React.lazy(() => import("./pages/Login"));
    const References = React.lazy(() => import("./pages/References"));
    const Recipes = React.lazy(() => import("./pages/Recipes"));
    const RecipesMoment = React.lazy(() => import("./pages/RecipesMoment"));
    const RecipesPressure = React.lazy(() => import("./pages/RecipesPressure"));
    const TagResults = React.lazy(() => import("./pages/TagResults"));
    const Users = React.lazy(() => import("./pages/Users"));
    const Plc = React.lazy(() => import("./pages/Plc"));
    const location = useLocation();

    return (
            <Routes location={location}>
                <Route path="/auth" element={<Suspense fallback={<Loading />}> <Login /> </Suspense>} />
                <Route element={<AuthLoader />}>
                    <Route path="/" element={<MainTemplate />} >
                        <Route index element={<Parts key={"parts"} />} />
                        <Route path="/reference"
                               element={<References key={"reference"} />} />
                        <Route path="/tags" element={<Recipes key={"tags"} />} />
                        <Route path="/recipe_graph_moment"
                               element={<RecipesMoment key={"recipe_graph_moment_main"}/>}
                        />
                        <Route path="/recipe_graph_pressure"
                               element={<RecipesPressure key={"recipe_graph_pressure_main"}/>}
                        />
                        <Route path="/tag_results" element={<TagResults key={"tag_results"} />} />
                        <Route path="/operations" element={<Operations key={"operations"} /> } />
                        <Route element={<PrivateRoute />}>
                            <Route path="/users" element={<Users key={"users"} />} />
                            <Route path="/plc" element={<Plc key={"plc"} />} />
                        </Route>
                        </Route>
                        <Route path="/operations_results" element={<OperationsResults key={"operationResults"} />} />
                    <Route path="/graph_effort" element={<Graphs key={"graphRealEffort"} />}  />
                    </Route>
            </Routes>
    );
})