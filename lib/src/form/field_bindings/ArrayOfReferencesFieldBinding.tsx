import React, { useMemo } from "react";
import { Box, Button, FormControl, FormHelperText } from "@mui/material";
import {
    Entity,
    EntityCollection,
    EntityReference,
    FieldProps,
    ResolvedProperty
} from "../../models";
import { ReferencePreview } from "../../preview";
import { ArrayContainer, FieldDescription, LabelWithIcon } from "../components";
import { ErrorView, ReferenceDialog } from "../../core";

import { useClearRestoreValue, useNavigationContext } from "../../hooks";
import { getReferenceFrom } from "../../core/util/entities";
import { ExpandablePanel } from "../../core/components/ExpandablePanel";


type ArrayOfReferencesFieldProps = FieldProps<EntityReference[]>;

/**
 * This field allows selecting multiple references.
 *
 * This is one of the internal components that get mapped natively inside forms
 * and tables to the specified properties.
 * @category Form fields
 */
export function ArrayOfReferencesFieldBinding({
                                           propertyKey,
                                           value,
                                           error,
                                           showError,
                                           isSubmitting,
                                           tableMode,
                                           property,
                                           includeDescription,
                                           setValue
                                       }: ArrayOfReferencesFieldProps) {

    const ofProperty = property.of as ResolvedProperty;
    if (ofProperty.dataType !== "reference") {
        throw Error("ArrayOfReferencesField expected a property containing references");
    }

    const expanded = property.expanded === undefined ? true : property.expanded;
    const [open, setOpen] = React.useState(false);
    const [onHover, setOnHover] = React.useState(false);
    const selectedIds = value && Array.isArray(value) ? value.map((ref) => ref.id) : [];

    useClearRestoreValue({
        property,
        value,
        setValue
    });

    const navigationContext = useNavigationContext();
    const collectionResolver: EntityCollection | undefined = useMemo(() => {
        return ofProperty.path ? navigationContext.getCollection(ofProperty.path) : undefined;
    }, [ofProperty.path]);

    if (!collectionResolver) {
        throw Error(`Couldn't find the corresponding collection for the path: ${ofProperty.path}`);
    }

    const onEntryClick = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onMultipleEntitiesSelected = (entities: Entity<any>[]) => {
        setValue(entities.map(e => getReferenceFrom(e)));
    };

    const buildEntry = (index: number, internalId: number) => {
        const entryValue = value && value.length > index ? value[index] : undefined;
        if (!entryValue)
            return <div>Internal ERROR</div>;
        return (
            <div
                onMouseEnter={() => setOnHover(true)}
                onMouseMove={() => setOnHover(true)}
                onMouseLeave={() => setOnHover(false)}>
                <ReferencePreview
                    path={ofProperty.path}
                    previewProperties={ofProperty.previewProperties}
                    size={"regular"}
                    onClick={onEntryClick}
                    reference={entryValue}
                    onHover={onHover}
                />
            </div>
        );
    };

    return (
        <>
            <FormControl fullWidth error={showError}>


                <ExpandablePanel
                    expanded={expanded}
                    title={
                        <FormHelperText filled
                                        required={property.validation?.required}>
                            <LabelWithIcon property={property}/>
                        </FormHelperText>}>

                    {!collectionResolver && <ErrorView
                        error={"The specified collection does not exist. Check console"}/>}

                    {collectionResolver && <>

                        <ArrayContainer value={value}
                                        name={propertyKey}
                                        buildEntry={buildEntry}
                                        disabled={isSubmitting}/>

                        <Box p={1}
                             justifyContent="center"
                             textAlign={"left"}>
                            <Button variant="outlined"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={onEntryClick}>
                                Edit {property.name}
                            </Button>
                        </Box>
                    </>}

                </ExpandablePanel>

                {includeDescription &&
                    <FieldDescription property={property}/>}

                {showError &&
                    typeof error === "string" &&
                    <FormHelperText>{error}</FormHelperText>}

            </FormControl>

            {collectionResolver && ofProperty.path && <ReferenceDialog open={open}
                                                    multiselect={true}
                                                    collection={collectionResolver}
                                                    path={ofProperty.path}
                                                    onClose={onClose}
                                                    onMultipleEntitiesSelected={onMultipleEntitiesSelected}
                                                    selectedEntityIds={selectedIds}
            />}
        </>
    );
}
