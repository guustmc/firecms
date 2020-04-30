import { ArrayProperty, EnumType, MapProperty, Properties } from "../../models";
import { FieldArray } from "formik";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core";
import React from "react";
import { Add, Remove } from "@material-ui/icons";
import { formStyles } from "../../styles";
import { CMSFieldProps } from "./CMSFieldProps";

interface ArrayMapFieldProps<T extends EnumType> extends CMSFieldProps<any[], ArrayProperty<T>> {
}

export default function ArrayMapField<T extends EnumType>({ name, property, value, createFormField, includeDescription, errors, touched }: ArrayMapFieldProps<T>) {

    if (property.of.dataType !== "map") {
        console.error(property);
        throw Error("Field misconfiguration: this array field should have type map");
    }

    const classes = formStyles();
    const mapProperty: MapProperty<any> = property.of;
    const properties: Properties = mapProperty.properties;

    return <FieldArray
        name={name}
        render={arrayHelpers => {

            const hasValue = value && value.length > 0;
            const error = touched && property.validation?.required && !value;

            return (

                <FormControl fullWidth error={error}>

                    <FormHelperText filled
                                    required={property.validation?.required}>
                        {property.title || name}
                    </FormHelperText>

                    <Paper elevation={0} className={classes.paper}>

                        {hasValue ? (
                            <Table>
                                <TableBody>
                                    {value.map((entryValue: any, index: number) => (
                                        <TableRow key={`field_${index}`}>
                                            {Object.entries(properties).map(([arrayKey, childProperty]) => {

                                                const errorElement = errors && errors[index];
                                                const touchedElement = touched && touched[index];

                                                return (
                                                    <TableCell
                                                        key={`field_${arrayKey}`}>
                                                        {createFormField(`${name}[${index}].${arrayKey}`,
                                                            childProperty,
                                                            entryValue ? entryValue[arrayKey] : null,
                                                            includeDescription,
                                                            errorElement,
                                                            touchedElement)}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell size={"small"}
                                                       padding={"none"}>
                                                <IconButton aria-label="remove"
                                                            onClick={() => arrayHelpers.remove(index)}>
                                                    <Remove/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell size={"small"}
                                                       padding={"none"}>
                                                <IconButton aria-label="insert"
                                                            onClick={() => arrayHelpers.insert(index + 1, {})}>
                                                    <Add/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Box margin={2}>
                                <Button onClick={() => arrayHelpers.push(null)}>
                                    {/* show this when user has removed all entries from the list */}
                                    Add
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {includeDescription && property.description &&
                    <Box>
                        <FormHelperText>{property.description}</FormHelperText>
                    </Box>}
                </FormControl>
            );
        }}
    />;

}
